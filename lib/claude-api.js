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
 * @returns {Promise<Object>} - Object containing generated snippets for each requested platform
 */
export async function generateSocialSnippets(content, platforms = ['xPost', 'linkedinPost', 'instagramCaption', 'substackNote']) {
  try {
    // Validate content
    if (!content || content.trim().length === 0) {
      throw new Error("Content is required");
    }

    // Map platform IDs to human-readable names and requirements
    const platformDetails = {
      xPost: {
        name: "X (Twitter)",
        instruction: "Create a concise, engaging post under 280 characters.",
        maxChars: 280
      },
      linkedinPost: {
        name: "LinkedIn",
        instruction: "Create 2-3 professional sentences highlighting key insights."
      },
      instagramCaption: {
        name: "Instagram",
        instruction: "Create a casual, visually-oriented caption around 125 characters."
      },
      facebook: {
        name: "Facebook",
        instruction: "Create a conversational post that encourages engagement."
      },
      substackNote: {
        name: "Substack",
        instruction: "Create 1-2 sentences that serve as a teaser to hook readers."
      }
    };

    // Build platform-specific instructions
    const platformInstructions = platforms
      .filter(platform => platformDetails[platform])
      .map(platform => {
        const details = platformDetails[platform];
        return `${details.name}: ${details.instruction}${details.maxChars ? ` Maximum length: ${details.maxChars} characters.` : ''}`;
      })
      .join('\n');

    // Define the system prompt for Claude
    const systemPrompt = `
      You are a social media content specialist. Your task is to convert long-form content into engaging, platform-optimized snippets.
      Based on the provided text, generate snippets for the following platforms:
      
      ${platformInstructions}
      
      Return these snippets in a structured JSON format with the following keys: ${platforms.join(', ')}.
      Include character counts for each snippet in your response.
    `;

    // Make API call to Claude
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240229",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
    });

    // Extract the JSON from Claude's response
    const responseText = response.content[0].text;
    
    // Parse the JSON response
    try {
      // If Claude returned properly formatted JSON
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                         responseText.match(/{[\s\S]*?}/);
      
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : responseText;
      const snippetsData = JSON.parse(jsonString);
      
      // Create result object with only the requested platforms
      const result = {};
      
      // Process each platform
      platforms.forEach(platform => {
        if (snippetsData[platform]) {
          const text = snippetsData[platform].text || snippetsData[platform];
          const charCount = text.length;
          
          result[platform] = {
            text,
            charCount,
            ...(platformDetails[platform]?.maxChars && { maxChars: platformDetails[platform].maxChars })
          };
        }
      });
      
      return result;
    } catch (parseError) {
      console.error("Error parsing Claude response:", parseError);
      
      // Fallback simple parsing if JSON extraction fails
      const lines = responseText.split("\n").filter(line => line.trim() !== "");
      const result = {};
      
      // Try to match each line to a platform based on markers in the text
      platforms.forEach((platform, index) => {
        // Simple heuristic to find platform content
        const platformLine = lines.find(line => 
          line.toLowerCase().includes(platformDetails[platform]?.name.toLowerCase())
        ) || (index < lines.length ? lines[index] : "");
        
        // Clean up the line to remove platform prefixes
        const text = platformLine.replace(/^[^:]*:\s*/, "").trim();
        
        result[platform] = {
          text,
          charCount: text.length,
          ...(platformDetails[platform]?.maxChars && { maxChars: platformDetails[platform].maxChars })
        };
      });
      
      return result;
    }
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw new Error("Failed to generate snippets. Please try again later.");
  }
}

/**
 * Regenerates a specific platform snippet
 * @param {string} content - The original long-form content
 * @param {string} platform - The platform to regenerate
 * @returns {Promise<Object>} - Object containing the regenerated snippet
 */
export async function regenerateSnippet(content, platform) {
  try {
    // Map platform to human-readable format and requirements
    const platformMap = {
      xPost: {
        name: "X (Twitter)",
        maxChars: 280,
        instruction: "Create a concise, engaging post under 280 characters."
      },
      linkedinPost: {
        name: "LinkedIn",
        instruction: "Create 2-3 professional sentences highlighting key insights."
      },
      instagramCaption: {
        name: "Instagram",
        instruction: "Create a casual, visually-oriented caption around 125 characters."
      },
      facebook: {
        name: "Facebook",
        instruction: "Create a conversational post that encourages engagement."
      },
      substackNote: {
        name: "Substack",
        instruction: "Create 1-2 sentences that serve as a teaser to hook readers."
      }
    };

    const platformInfo = platformMap[platform];
    if (!platformInfo) {
      throw new Error("Invalid platform specified");
    }

    // Build platform-specific prompt
    const systemPrompt = `
      You are a social media content specialist. 
      Generate a single ${platformInfo.name} post based on the provided content.
      ${platformInfo.instruction}
      ${platformInfo.maxChars ? `Maximum character count: ${platformInfo.maxChars}.` : ''}
      Return only the text of the post without any additional formatting or explanations.
    `;

    // Make API call to Claude
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240229",
      max_tokens: 500,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
    });

    // Extract the snippet from Claude's response
    const snippetText = response.content[0].text.trim();
    
    // Return formatted result
    return {
      text: snippetText,
      charCount: snippetText.length,
      maxChars: platformInfo.maxChars
    };
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