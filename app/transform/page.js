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
  const [debugInfo, setDebugInfo] = useState(null);
  const [snippets, setSnippets] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    xPost: true,
    linkedinPost: false,
    instagramCaption: false,
    substackNote: false,
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

  // Generate snippets for selected platform only
  const handleGenerateSnippets = async (e) => {
    e.preventDefault();
    setError('');
    setDebugInfo(null);
    
    if (!content.trim()) {
      setError('Please enter some content to generate snippets');
      return;
    }
    
    // Check if any platform is selected
    const hasSelectedPlatform = Object.entries(selectedPlatforms)
      .some(([_, isSelected]) => isSelected);
    
    if (!hasSelectedPlatform) {
      setError('Please select a platform');
      return;
    }
    
    // Get the single selected platform
    const selectedPlatform = Object.entries(selectedPlatforms)
      .find(([_, isSelected]) => isSelected)[0];
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/generate-snippets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content,
          platforms: [selectedPlatform], // Only send the selected platform
          variantsPerPlatform: 3 // Request 3 variants
        }),
      });
      
      // Get raw response text first for debugging
      const rawResponseText = await response.text();
      console.log('Raw API response:', rawResponseText);
      console.log('Response length:', rawResponseText.length);
      
      if (rawResponseText.length > 0) {
        console.log('First character code:', rawResponseText.charCodeAt(0));
        console.log('First 50 characters:', rawResponseText.substring(0, 50));
      }
      
      // Store debug info
      setDebugInfo({
        rawLength: rawResponseText.length,
        firstCharCode: rawResponseText.length > 0 ? rawResponseText.charCodeAt(0) : null,
        firstFiftyChars: rawResponseText.substring(0, 50),
        responseStatus: response.status,
        responseStatusText: response.statusText,
        contentType: response.headers.get('content-type')
      });
      
      // Only try to parse if we have content
      if (!rawResponseText || rawResponseText.trim() === '') {
        throw new Error('Empty response from API');
      }
      
      // Try to parse the JSON
      let data;
      try {
        data = JSON.parse(rawResponseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        
        // Try to clean the response if it might have BOM or whitespace
        const cleaned = rawResponseText.trim().replace(/^\uFEFF/, '');
        try {
          data = JSON.parse(cleaned);
          console.log('Successfully parsed after cleaning');
        } catch (secondParseError) {
          throw new Error(`Failed to parse response as JSON: ${parseError.message}`);
        }
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate snippets');
      }
      
      // Transform the API response into our expected format with variants
      const transformedSnippets = {};
      
      // Handle response format with array of variants
      if (Array.isArray(data.snippets[selectedPlatform])) {
        transformedSnippets[selectedPlatform] = {
          variants: data.snippets[selectedPlatform].map(variant => ({
            text: variant.text,
            counter: selectedPlatform === 'xPost' 
              ? `${variant.text.length}/${variant.maxChars || 280}`
              : `${variant.text.length} characters`,
            isRegenerating: false
          }))
        };
      } else {
        // Fallback handling if API returns unexpected format
        console.warn('API did not return expected variant array format');
        transformedSnippets[selectedPlatform] = {
          variants: Array(3).fill().map(() => ({
            text: 'Error: API response format incorrect. Please try again.',
            counter: '0/0',
            isRegenerating: false
          }))
        };
      }
      
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
      if (!prev || !prev[platform]?.variants) return prev;
      
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
        body: JSON.stringify({ 
          content, 
          platform,
          variantIndex
        }),
      });
      
      // Get raw response first for debugging
      const rawResponseText = await response.text();
      console.log(`Raw regenerate API response (${platform}, variant ${variantIndex}):`, rawResponseText);
      
      // Try to parse JSON with error handling
      let data;
      try {
        data = JSON.parse(rawResponseText);
      } catch (parseError) {
        console.error('Regenerate JSON parse error:', parseError);
        const cleaned = rawResponseText.trim().replace(/^\uFEFF/, '');
        try {
          data = JSON.parse(cleaned);
        } catch (secondError) {
          throw new Error(`Failed to parse regenerate response: ${parseError.message}`);
        }
      }
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to regenerate ${platform}`);
      }
      
      // Update just the specific snippet variant in state
      setSnippets(prev => {
        if (!prev || !prev[platform]?.variants) return prev;
        
        const updatedVariants = [...prev[platform].variants];
        updatedVariants[variantIndex] = { 
          text: data.snippet.text,
          counter: platform === 'xPost' 
            ? `${data.snippet.text.length}/${data.snippet.maxChars || 280}`
            : `${data.snippet.text.length} characters`,
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
      console.error(`Error regenerating ${platform} variant ${variantIndex}:`, err);
      
      // Reset regenerating state on error
      setSnippets(prev => {
        if (!prev || !prev[platform]?.variants) return prev;
        
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
      if (!prev || !prev[platform]?.variants) return prev;
      
      const updatedVariants = [...prev[platform].variants];
      const maxChars = platform === 'xPost' ? 
        (updatedVariants[variantIndex].counter.split('/')[1] || 280) : null;
      
      updatedVariants[variantIndex] = { 
        ...updatedVariants[variantIndex],
        text: newText,
        counter: platform === 'xPost' 
          ? `${newText.length}/${maxChars}`
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

  // Handle platform selection change - allow only one selection
  const handlePlatformChange = (platform, isSelected) => {
    // If selecting a platform, deselect all others
    if (isSelected) {
      const newSelectedPlatforms = Object.keys(selectedPlatforms).reduce((acc, key) => {
        acc[key] = key === platform;
        return acc;
      }, {});
      setSelectedPlatforms(newSelectedPlatforms);
    } else {
      // If deselecting, just update the one platform
      setSelectedPlatforms(prev => ({...prev, [platform]: isSelected}));
    }
  };

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

  // Select a specific variant
  const handleSelectVariant = (platform, variantIndex) => {
    setSnippets(prev => {
      if (!prev || !prev[platform]?.variants) return prev;
      
      const updatedVariants = prev[platform].variants.map((variant, idx) => ({
        ...variant,
        isActive: idx === variantIndex
      }));
      
      return {
        ...prev,
        [platform]: {
          ...prev[platform],
          variants: updatedVariants
        }
      };
    });
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
          <h3 className="text-lg font-medium text-gray-700 mb-2">Choose a platform:</h3>
          <PlatformSelector 
            selectedPlatforms={selectedPlatforms}
            onPlatformChange={handlePlatformChange}
          />
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="font-medium text-red-600">Error</p>
            <p className="text-red-600">{error}</p>
            
            {/* Debug information */}
            {debugInfo && (
              <div className="mt-3">
                <p className="text-sm font-medium text-red-500">Debugging Information:</p>
                <div className="mt-1 p-3 bg-red-100 rounded text-xs font-mono overflow-x-auto">
                  <p>Response Status: {debugInfo.responseStatus} {debugInfo.responseStatusText}</p>
                  <p>Content-Type: {debugInfo.contentType}</p>
                  <p>Response Length: {debugInfo.rawLength} characters</p>
                  {debugInfo.firstCharCode !== null && (
                    <p>First Character Code: {debugInfo.firstCharCode}</p>
                  )}
                  {debugInfo.firstFiftyChars && (
                    <div>
                      <p>First 50 characters:</p>
                      <p className="break-all">{debugInfo.firstFiftyChars}</p>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-sm text-red-500">
                  <p>Common causes for JSON parsing errors:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>API returning HTML or plain text instead of JSON</li>
                    <li>Whitespace or special characters before JSON content</li>
                    <li>Empty response from server</li>
                    <li>Server-side error in generating the response</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
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