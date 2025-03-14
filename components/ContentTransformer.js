'use client';

import { useState } from 'react';
import CardSnippet from '@/components/CardSnippet';
import ButtonGenerate from '@/components/ButtonGenerate';
import PlatformSelector from '@/components/PlatformSelector';

export default function ContentTransformer() {
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [snippets, setSnippets] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    x: true,
    linkedin: true,
    instagram: true,
    substack: true,
    facebook: true
  });
  
  async function handleGenerateSnippets() {
    if (!inputText.trim()) return;
    
    // Make sure at least one platform is selected
    const hasSelectedPlatforms = Object.values(selectedPlatforms).some(isSelected => isSelected);
    if (!hasSelectedPlatforms) return;
    
    setIsGenerating(true);
    
    try {
      // In a real app, this would be an API call to your backend
      // For demo purposes, we're simulating the API response
      const response = await simulateApiCall(inputText, selectedPlatforms);
      setSnippets(response);
    } catch (error) {
      console.error('Failed to generate snippets:', error);
      // In a production app, you'd want to show an error message to the user
    } finally {
      setIsGenerating(false);
    }
  }
  
  async function handleRegenerateVariant(platform, variantIndex) {
    if (!inputText.trim()) return;
    
    // Track which variant is regenerating
    setSnippets(prev => {
      const updatedVariants = [...prev[platform].variants];
      updatedVariants[variantIndex] = { 
        ...updatedVariants[variantIndex], 
        isRegenerating: true 
      };
      
      return {
        ...prev,
        [platform]: { 
          ...prev[platform], 
          variants: updatedVariants 
        }
      };
    });
    
    try {
      // In a real app, this would be an API call with the platform and variant specified
      const newVariant = await simulateRegenerateVariantApiCall(inputText, platform);
      
      setSnippets(prev => {
        const updatedVariants = [...prev[platform].variants];
        updatedVariants[variantIndex] = { 
          text: newVariant.text, 
          counter: newVariant.counter,
          isRegenerating: false
        };
        
        return {
          ...prev,
          [platform]: { 
            ...prev[platform], 
            variants: updatedVariants 
          }
        };
      });
    } catch (error) {
      console.error(`Failed to regenerate ${platform} variant ${variantIndex}:`, error);
      // Reset regenerating state
      setSnippets(prev => {
        const updatedVariants = [...prev[platform].variants];
        updatedVariants[variantIndex] = { 
          ...updatedVariants[variantIndex], 
          isRegenerating: false 
        };
        
        return {
          ...prev,
          [platform]: { 
            ...prev[platform], 
            variants: updatedVariants 
          }
        };
      });
    }
  }
  
  function handleSnippetEdit(platform, variantIndex, newText) {
    setSnippets(prev => {
      const updatedVariants = [...prev[platform].variants];
      updatedVariants[variantIndex] = { 
        ...updatedVariants[variantIndex],
        text: newText,
        counter: getPlatformCounter(platform, newText)
      };
      
      return {
        ...prev,
        [platform]: { 
          ...prev[platform], 
          variants: updatedVariants 
        }
      };
    });
  }
  
  return (
    <div className="flex flex-col gap-6">
      {/* Input Section */}
      <section className="w-full">
        <textarea
          className="w-full h-72 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Paste your article or blog post here…"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        
        <div className="mt-6 mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Choose platforms:</h3>
          <PlatformSelector 
            selectedPlatforms={selectedPlatforms}
            onPlatformChange={(platform, isSelected) => {
              setSelectedPlatforms(prev => ({...prev, [platform]: isSelected}));
            }}
          />
        </div>
        
        <div className="mt-6 flex justify-center">
          <ButtonGenerate 
            onClick={handleGenerateSnippets} 
            isGenerating={isGenerating} 
            disabled={
              !inputText.trim() || 
              isGenerating || 
              !Object.values(selectedPlatforms).some(isSelected => isSelected)
            }
          />
        </div>
      </section>
      
      {/* Loading State */}
      {isGenerating && (
        <div className="flex justify-center items-center py-8">
          <div className="inline-flex items-center px-4 py-2 font-semibold text-sm text-gray-500">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </div>
        </div>
      )}
      
      {/* Output Section */}
      {snippets && !isGenerating && (
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-4">Generated Snippets</h2>
          
          <div className="space-y-8">
            {Object.entries(snippets).map(([platform, platformData]) => (
              <div key={platform} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  {getPlatformDisplayName(platform)}
                </h3>
                <div className="space-y-4">
                  {platformData.variants.map((variant, index) => (
                    <CardSnippet
                      key={`${platform}-${index}`}
                      platform={platform}
                      text={variant.text}
                      counter={variant.counter}
                      isRegenerating={variant.isRegenerating}
                      onEdit={(newText) => handleSnippetEdit(platform, index, newText)}
                      onRegenerate={() => handleRegenerateVariant(platform, index)}
                      variantNumber={index + 1}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Helper functions
function getPlatformCounter(platform, text) {
  switch (platform) {
    case 'x':
      return `${text.length}/280`;
    case 'linkedin':
      return `${text.length} characters`;
    case 'instagram':
      return `${text.length} characters`;
    case 'facebook':
      return `${text.length} characters`;
    case 'substack':
      return `${text.length} characters`;
    default:
      return '';
  }
}

function getPlatformDisplayName(platform) {
  switch (platform) {
    case 'x':
      return 'X (Twitter)';
    case 'linkedin':
      return 'LinkedIn';
    case 'instagram':
      return 'Instagram';
    case 'facebook':
      return 'Facebook';
    case 'substack':
      return 'Substack';
    default:
      return platform;
  }
}

// API simulation functions for demo purposes
async function simulateApiCall(inputText, selectedPlatforms) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const result = {};
  
  // Generate variants for each selected platform
  if (selectedPlatforms.x) {
    result.x = {
      variants: [
        {
          text: `Key insight from this article: ${inputText.substring(0, 200)}${inputText.length > 200 ? '...' : ''}`,
          counter: '240/280'
        },
        {
          text: `Just published: ${inputText.substring(0, 180)}${inputText.length > 180 ? '...' : ''} Thoughts?`,
          counter: '220/280'
        },
        {
          text: `"${inputText.substring(0, 120)}..." - from my latest piece. Click the link to read more!`,
          counter: '175/280'
        },
        {
          text: `I've been exploring ${inputText.substring(0, 160)}${inputText.length > 160 ? '...' : ''} What do you think about this?`,
          counter: '210/280'
        },
        {
          text: `THREAD: 1/5 ${inputText.substring(0, 150)}${inputText.length > 150 ? '...' : ''} #ContentCreation`,
          counter: '190/280'
        }
      ]
    };
  }
  
  if (selectedPlatforms.linkedin) {
    result.linkedin = {
      variants: [
        {
          text: `I've been thinking about ${inputText.substring(0, 100)}... What are your thoughts on this topic? #ProfessionalDevelopment`,
          counter: '160 characters'
        },
        {
          text: `New article alert: ${inputText.substring(0, 110)}... Would love your professional input on this! #Innovation`,
          counter: '170 characters'
        },
        {
          text: `Recent developments in ${inputText.substring(0, 90)}... have significant implications for our industry. Thoughts?`,
          counter: '150 characters'
        },
        {
          text: `After researching ${inputText.substring(0, 100)}..., I've found some interesting trends that could impact how we approach this challenge.`,
          counter: '165 characters'
        },
        {
          text: `Proud to share my latest insights on ${inputText.substring(0, 80)}... - a topic that's transforming our professional landscape. #Growth #Leadership`,
          counter: '175 characters'
        }
      ]
    };
  }
  
  if (selectedPlatforms.instagram) {
    result.instagram = {
      variants: [
        {
          text: `✨ ${inputText.substring(0, 80)}... #ContentCreation #SocialMedia`,
          counter: '100 characters'
        },
        {
          text: `📱 ${inputText.substring(0, 70)}... Check out the full piece (link in bio) #Content #Engagement`,
          counter: '110 characters'
        },
        {
          text: `Today's wisdom: "${inputText.substring(0, 60)}..." 💭 #Inspiration #Growth`,
          counter: '90 characters'
        },
        {
          text: `Dropping knowledge about ${inputText.substring(0, 65)}... 🔥 Who else is passionate about this? #Trending`,
          counter: '115 characters'
        },
        {
          text: `🚀 Just published! "${inputText.substring(0, 75)}..." - Tap link in bio to read the full story! #NewContent`,
          counter: '125 characters'
        }
      ]
    };
  }
  
  if (selectedPlatforms.facebook) {
    result.facebook = {
      variants: [
        {
          text: `Just wanted to share some thoughts on ${inputText.substring(0, 120)}... What's your experience with this?`,
          counter: '155 characters'
        },
        {
          text: `I've been researching ${inputText.substring(0, 100)} lately and it's fascinating how much this affects our daily lives. Anyone else interested in this topic?`,
          counter: '170 characters'
        },
        {
          text: `Question for my network: How do you approach ${inputText.substring(0, 90)}? I just published an article with my perspective.`,
          counter: '140 characters'
        },
        {
          text: `Exciting news! I just published a new piece about ${inputText.substring(0, 80)}. Check out the link for the full read! 👇`,
          counter: '135 characters'
        },
        {
          text: `"${inputText.substring(0, 70)}..." - This quote from my latest article really captures the essence of what I've been working on lately.`,
          counter: '145 characters'
        }
      ]
    };
  }
  
  if (selectedPlatforms.substack) {
    result.substack = {
      variants: [
        {
          text: `In my latest deep dive, I explore ${inputText.substring(0, 120)}. Read more in this week's newsletter.`,
          counter: '140 characters'
        },
        {
          text: `This week's newsletter explores ${inputText.substring(0, 100)}. Subscribe to join the conversation!`,
          counter: '130 characters'
        },
        {
          text: `Just sent: An analysis of ${inputText.substring(0, 110)}. Open your inbox for the full story.`,
          counter: '120 characters'
        },
        {
          text: `The most important thing about ${inputText.substring(0, 90)} is often overlooked. I break it down in today's newsletter.`,
          counter: '135 characters'
        },
        {
          text: `📬 Fresh in your inbox: "${inputText.substring(0, 80)}..." - a comprehensive look at this emerging trend.`,
          counter: '115 characters'
        }
      ]
    };
  }
  
  return result;
}

async function simulateRegenerateVariantApiCall(inputText, platform) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate a random unique variant
  const variants = {
    x: [
      {
        text: `NEW: ${inputText.substring(0, 190)}${inputText.length > 190 ? '...' : ''} Curious what others think?`,
        counter: '235/280'
      },
      {
        text: `Hot take on ${inputText.substring(0, 200)}${inputText.length > 200 ? '...' : ''} #Trending`,
        counter: '230/280'
      }
    ],
    linkedin: [
      {
        text: `Breaking it down: ${inputText.substring(0, 120)}... is changing how we approach business. #Innovation #FutureOfWork`,
        counter: '180 characters'
      },
      {
        text: `Professional insight: ${inputText.substring(0, 100)}... has significant implications for our industry's future.`,
        counter: '160 characters'
      }
    ],
    instagram: [
      {
        text: `💡 Insight of the day: ${inputText.substring(0, 70)}... (More in my latest post) #Wisdom #Growth`,
        counter: '120 characters'
      },
      {
        text: `Today I'm sharing about ${inputText.substring(0, 75)}... 📲 Tag someone who needs to see this! #Value #Share`,
        counter: '125 characters'
      }
    ],
    facebook: [
      {
        text: `I've been reflecting on ${inputText.substring(0, 110)} lately. Has anyone else noticed how this is changing our perspective?`,
        counter: '160 characters'
      },
      {
        text: `Food for thought: ${inputText.substring(0, 95)}... What's your take on this emerging trend?`,
        counter: '130 characters'
      }
    ],
    substack: [
      {
        text: `Latest from my newsletter: A deep analysis of ${inputText.substring(0, 95)}. Click to read the nuanced take.`,
        counter: '140 characters'
      },
      {
        text: `Just published: Why ${inputText.substring(0, 115)} matters more than you might think. Full breakdown in today's newsletter.`,
        counter: '150 characters'
      }
    ]
  };
  
  // Return a random variant from the appropriate platform
  const randomIndex = Math.floor(Math.random() * variants[platform].length);
  return variants[platform][randomIndex];
}