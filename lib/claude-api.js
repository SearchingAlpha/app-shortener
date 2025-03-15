// lib/claude-api.js
"use server";

import { Anthropic } from "@anthropic-ai/sdk";

// Initialize the Anthropic client with API key
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Processes long-form content into platform-specific social media snippets
 * @param {string} content - The original long-form content
 * @param {string[]} platforms - Array of platform IDs to generate snippets for
 * @param {number} variantsPerPlatform - Number of variants to generate per platform
 * @returns {Promise<Object>} - Object containing generated snippets for each requested platform
 */
export async function generateSocialSnippets(content, platforms = ['xPost', 'linkedinPost', 'instagramCaption', 'substackNote'], variantsPerPlatform = 1) {
  try {
    // Validate content
    if (!content || content.trim().length === 0) {
      throw new Error("Content is required");
    }

    // Create object to hold results
    const result = {};
    
    // Generate snippets for each platform
    for (const platform of platforms) {
      try {
        // Generate variants for this specific platform
        const variants = await generatePlatformSnippets(content, platform, variantsPerPlatform);
        result[platform] = variants;
      } catch (error) {
        console.error(`Error generating snippets for ${platform}:`, error);
        // Continue with other platforms even if one fails
        result[platform] = [{
          text: `Failed to generate ${platform} snippet: ${error.message}`,
          charCount: 0,
          error: true
        }];
      }
    }
    
    return result;
  } catch (error) {
    console.error("Error generating social snippets:", error);
    throw new Error("Failed to generate snippets. Please try again later.");
  }
}

/**
 * Generates variants for a specific platform
 * @param {string} content - The original content
 * @param {string} platform - Platform ID
 * @param {number} variantsCount - Number of variants to generate
 * @returns {Promise<Array>} - Array of variant objects
 */
async function generatePlatformSnippets(content, platform, variantsCount = 1) {
  // Construct platform-specific prompt
  const prompt = constructPromptForPlatform(content, platform);
  
  try {
    // Make API call to Claude
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `${prompt}\n\nPlease generate exactly ${variantsCount} different variants. Format your response as a JSON object with a single 'snippets' key containing an array of objects. Each object should have a 'text' property containing the snippet content. Only respond with valid JSON, nothing else.`
        }
      ]
      // Remove response_format parameter as it's causing issues
    });

    // Extract the snippet text from Claude's response
    const responseContent = response.content[0].text;
    
    // Parse the JSON response
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseContent);
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
      // Fallback if JSON parsing fails
      jsonResponse = { 
        snippets: [{ 
          text: responseContent.substring(0, getPlatformMaxChars(platform) || 280) 
        }] 
      };
    }
    
    const variants = jsonResponse.snippets || [];
    
    // Add platform-specific properties
    return variants.map(variant => {
      const maxChars = getPlatformMaxChars(platform);
      
      return {
        text: variant.text || '',
        charCount: variant.text?.length || 0,
        ...(maxChars && { maxChars })
      };
    });
  } catch (error) {
    console.error(`Error generating ${platform} snippets:`, error);
    throw error;
  }
}

/**
 * Gets the maximum character count for a platform
 * @param {string} platform - Platform ID
 * @returns {number|null} - Maximum character count or null if unlimited
 */
function getPlatformMaxChars(platform) {
  const limits = {
    xPost: 280,
    instagramCaption: 2200,
    linkedinPost: 3000,
    substackNote: 500,
    facebook: 5000
  };
  
  return limits[platform] || null;
}

/**
 * Constructs platform-specific prompts
 * @param {string} content - The original content
 * @param {string} platform - Platform ID
 * @returns {string} - Constructed prompt
 */
function constructPromptForPlatform(content, platform) {
  const basePrompt = `
    I need to create social media content based on the following text. 
    Please preserve the essence, style, voice, and LANGUAGE of the original while optimizing for the platform.
    The output MUST be in the same language as the input text - this is critically important.
    Make the output unique, engaging, and authentic to the original writer's style.
    Original content:
    
    ${content}
  `;

  const platformSpecificPrompts = {
    xPost: `
      Please create a post for Twitter/X with these requirements:
      - Maximum 280 characters
      - Capture the most compelling point or insight
      - Maintain the original author's tone and style
      - Make it shareable and conversation-starting
      - Don't use hashtags unless they're essential
    `,
    
    linkedinPost: `
      Please create a LinkedIn post with these requirements:
      - Professional but conversational tone
      - 2-4 short paragraphs maximum
      - Highlight business value or professional insights
      - Maintain the original author's expertise and credibility
      - Frame content to encourage professional discussion
      - End with a thought-provoking question if appropriate
    `,
    
    instagramCaption: `
      Please create an Instagram caption with these requirements:
      - Casual, authentic tone that matches the original writer
      - Visual and emotive language that complements potential imagery
      - 1-3 paragraphs with appropriate spacing
      - Include 3-5 relevant hashtags at the end if appropriate
      - Maintain the original writer's unique voice and perspective
    `,
    
    substackNote: `
      Please create a Substack teaser note with these requirements:
      - 1-2 short paragraphs that hook the reader
      - Hint at valuable insights without giving everything away
      - Maintain the original writer's voice and authority
      - Should make readers want to click through to read the full piece
      - End with a subtle call-to-action or curiosity gap
    `,
    
    facebook: `
      Please create a Facebook post with these requirements:
      - Conversational and engaging tone
      - 2-3 paragraphs with good spacing for readability
      - Include a hook that encourages comments or shares
      - Maintain the original writer's voice and perspective
      - End with a question or call to action if appropriate
    `
  };

  return basePrompt + (platformSpecificPrompts[platform] || '');
}

/**
 * Regenerates a specific platform snippet
 * @param {string} content - The original long-form content
 * @param {string} platform - The platform to regenerate
 * @returns {Promise<Object>} - Object containing the regenerated snippet
 */
export async function regenerateSnippet(content, platform) {
  try {
    // Validate platform
    if (!platform || typeof platform !== 'string') {
      throw new Error("Valid platform ID is required");
    }
    
    // Construct platform-specific prompt
    const prompt = constructPromptForPlatform(content, platform);
    
    try {
      // Make API call to Claude with more advanced model
      const response = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219", 
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `${prompt}\n\nPlease generate a single variant for the ${platform} platform. Format your response as a JSON object with the following structure: {"text": "your generated content here"}. Only respond with valid JSON, nothing else.`
          }
        ]
        // Remove response_format parameter here as well
      });

      // Extract the snippet text from Claude's response
      const responseContent = response.content[0].text;
      
      // Parse the JSON response with error handling
      let snippetText;
      try {
        // Log the response for debugging
        console.log("Raw response:", responseContent);
        
        const jsonResponse = JSON.parse(responseContent);
        
        // Handle different possible response structures
        if (jsonResponse.snippets && jsonResponse.snippets[platform]) {
          // Handle format: {"snippets":{"platformName":[{"text":"content"}]}}
          snippetText = jsonResponse.snippets[platform][0]?.text || '';
        } else if (jsonResponse.snippets && Array.isArray(jsonResponse.snippets)) {
          // Handle format: {"snippets":[{"text":"content"}]}
          snippetText = jsonResponse.snippets[0]?.text || '';
        } else if (jsonResponse.text) {
          // Handle format: {"text":"content"}
          snippetText = jsonResponse.text;
        } else if (jsonResponse.snippet && jsonResponse.snippet.text) {
          // Handle format: {"snippet":{"text":"content"}}
          snippetText = jsonResponse.snippet.text;
        } else {
          // Fallback for unknown structure
          snippetText = JSON.stringify(jsonResponse).substring(0, getPlatformMaxChars(platform) || 280);
        }
      } catch (error) {
        console.error("Failed to parse JSON response:", error, responseContent);
        // Use the raw response as fallback
        snippetText = responseContent.substring(0, getPlatformMaxChars(platform) || 280);
      }
      
      const maxChars = getPlatformMaxChars(platform);
      
      return {
        text: snippetText,
        charCount: snippetText.length,
        ...(maxChars && { maxChars })
      };
    } catch (error) {
      console.error(`Error regenerating ${platform} snippet:`, error);
      throw error;
    }
  } catch (error) {
    console.error("Error regenerating snippet:", error);
    throw new Error(`Failed to regenerate ${platform}. Please try again later.`);
  }
}

/**
 * Process text content from uploaded files
 * @param {Buffer} fileBuffer - The file content as a buffer
 * @param {string} fileName - The name of the file
 * @returns {Promise<string>} - Extracted text content
 */
export async function extractTextFromFile(fileBuffer, fileName) {
  try {
    // Determine file type from extension
    const fileExtension = fileName.split('.').pop().toLowerCase();
    
    // For now, only handle text files
    // In a production app, you'd want to add support for PDF, DOCX, etc.
    if (fileExtension === 'txt' || fileExtension === 'md') {
      // Convert buffer to text
      const textContent = new TextDecoder().decode(fileBuffer);
      return textContent;
    }
    
    throw new Error(`Unsupported file type: ${fileExtension}`);
  } catch (error) {
    console.error("Error extracting text from file:", error);
    throw new Error("Failed to extract text from file. Please try a different file format.");
  }
}