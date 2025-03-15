'use client';

import { useState } from 'react';
import PlatformSelector from '@/components/ui/platformSelector';
import ButtonGenerate from '@/components/ui/ButtonGenerate';
import CardSnippet from '@/components/CardSnippet';
import FileAttachment from '@/components/FileAttachment';

export default function ContentGenerator() {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [snippets, setSnippets] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    xPost: true,
    linkedinPost: true,
    instagramCaption: true,
    substackNote: true,
    facebook: false
  });

  // Handle file list updates
  const handleFileChange = (fileList) => {
    setFiles(fileList);
  };
  
  // Handle content extraction from files
  const handleContentExtracted = (extractedContent) => {
    setContent(extractedContent);
  };

  // Generate all snippets
  const handleGenerateSnippets = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!content.trim()) {
      setError('Please enter some content to generate snippets');
      return;
    }
    
    // Check if any platform is selected
    const hasSelectedPlatforms = Object.entries(selectedPlatforms)
      .some(([_, isSelected]) => isSelected);
    
    if (!hasSelectedPlatforms) {
      setError('Please select at least one platform');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare data for API call (include only selected platforms)
      const selectedPlatformsArray = Object.entries(selectedPlatforms)
        .filter(([_, isSelected]) => isSelected)
        .map(([platform]) => platform);
      
      const response = await fetch('/api/generate-snippets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content,
          platforms: selectedPlatformsArray
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate snippets');
      }
      
      // Transform the API response into our expected format with variants
      const transformedSnippets = {};
      
      Object.entries(data.snippets).forEach(([platform, snippet]) => {
        transformedSnippets[platform] = {
          variants: [{
            text: snippet.text,
            counter: platform === 'xPost' 
              ? `${snippet.charCount}/${snippet.maxChars || 280}`
              : `${snippet.charCount} characters`,
            isRegenerating: false
          }]
        };
      });
      
      setSnippets(transformedSnippets);
    } catch (err) {
      console.error('Error generating snippets:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Regenerate a specific snippet variant
  const handleRegenerateVariant = async (platform, variantIndex) => {
    if (!content.trim()) return;
    
    // Update the UI to show regenerating state
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
      const response = await fetch('/api/regenerate-snippet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, platform }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to regenerate ${platform}`);
      }
      
      // Update just the specific snippet in state
      setSnippets(prev => {
        const updatedVariants = [...prev[platform].variants];
        updatedVariants[variantIndex] = { 
          text: data.snippet.text,
          counter: platform === 'xPost' 
            ? `${data.snippet.charCount}/${data.snippet.maxChars || 280}`
            : `${data.snippet.charCount} characters`,
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
    } catch (err) {
      console.error(`Error regenerating ${platform}:`, err);
      
      // Reset regenerating state on error
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
      
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };
  
  // Handle editing of a snippet
  const handleSnippetEdit = (platform, variantIndex, newText) => {
    setSnippets(prev => {
      const updatedVariants = [...prev[platform].variants];
      updatedVariants[variantIndex] = { 
        ...updatedVariants[variantIndex],
        text: newText,
        counter: platform === 'xPost' 
          ? `${newText.length}/${updatedVariants[variantIndex].counter.split('/')[1]}`
          : `${newText.length} characters`
      };
      
      return {
        ...prev,
        [platform]: { 
          ...prev[platform], 
          variants: updatedVariants 
        }
      };
    });
  };

  // Handle platform selection change
  const handlePlatformChange = (platform, isSelected) => {
    setSelectedPlatforms(prev => ({...prev, [platform]: isSelected}));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Upload Content or Enter Text</h2>
        
        <div className="mb-6">
          <FileAttachment 
            onFileChange={handleFileChange}
            onContentExtracted={handleContentExtracted} 
          />
        </div>
        
        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Paste your article or blog post here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isLoading}
        />
        
        <div className="mt-6 mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Choose platforms:</h3>
          <PlatformSelector 
            selectedPlatforms={selectedPlatforms}
            onPlatformChange={handlePlatformChange}
          />
        </div>
        
        {error && (
          <div className="mt-2 text-red-500 text-sm">{error}</div>
        )}
        
        <div className="mt-6 flex justify-center">
          <ButtonGenerate
            onClick={handleGenerateSnippets}
            isGenerating={isLoading}
            disabled={
              isLoading || 
              !content.trim() || 
              !Object.values(selectedPlatforms).some(isSelected => isSelected)
            }
          />
        </div>
      </div>
      
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-gray-600">Generating your snippets...</p>
        </div>
      )}
      
      {snippets && !isLoading && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Social Snippets</h2>
          
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
      )}
    </div>
  );
}

// Helper function to get platform display name
function getPlatformDisplayName(platform) {
  switch (platform) {
    case 'xPost':
      return 'X (Twitter)';
    case 'linkedinPost':
      return 'LinkedIn';
    case 'instagramCaption':
      return 'Instagram';
    case 'facebook':
      return 'Facebook';
    case 'substackNote':
      return 'Substack';
    default:
      return platform.charAt(0).toUpperCase() + platform.slice(1);
  }
}