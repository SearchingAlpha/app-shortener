'use client';

import { useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';

// EditableSnippet component for each platform's output
const EditableSnippet = ({ platform, snippet, onRegenerate }) => {
  const [text, setText] = useState(snippet.text);
  const [isEditing, setIsEditing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Handle regeneration of a specific snippet
  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerate(platform);
    } catch (error) {
      console.error(`Error regenerating ${platform}:`, error);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Get platform-specific details
  const getPlatformDetails = () => {
    const details = {
      xPost: {
        label: "X Post",
        maxChars: 280,
      },
      linkedinPost: {
        label: "LinkedIn Post",
      },
      instagramCaption: {
        label: "Instagram Caption",
        maxChars: 2200,
      },
      substackNote: {
        label: "Substack Note",
      },
    };
    return details[platform] || { label: platform };
  };

  const platformDetails = getPlatformDetails();
  const charCount = text?.length || 0;
  const hasMaxChars = !!platformDetails.maxChars;
  const isOverLimit = hasMaxChars && charCount > platformDetails.maxChars;

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-gray-800">{platformDetails.label}</h3>
        {hasMaxChars && (
          <span className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
            {charCount}/{platformDetails.maxChars}
          </span>
        )}
      </div>
      
      <div 
        className={`min-h-24 p-2 rounded ${isEditing ? 'bg-gray-50 ring-1 ring-blue-300' : ''}`}
        onClick={() => setIsEditing(true)}
        onBlur={() => setIsEditing(false)}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onInput={(e) => setText(e.currentTarget.textContent || '')}
      >
        {snippet.text}
      </div>
      
      <div className="flex justify-end mt-2">
        <button 
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="text-blue-600 text-sm flex items-center hover:text-blue-800 disabled:text-gray-400"
        >
          {isRegenerating ? (
            <>
              <FiRefreshCw className="animate-spin mr-1" />
              Regenerating...
            </>
          ) : (
            <>
              <FiRefreshCw className="mr-1" />
              Regenerate
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Main component for the input/output page
export default function ContentGenerator() {
  const [content, setContent] = useState('');
  const [snippets, setSnippets] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate all snippets
  const handleGenerateSnippets = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!content.trim()) {
      setError('Please enter some content to generate snippets');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/generate-snippets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate snippets');
      }
      
      setSnippets(data.snippets);
    } catch (err) {
      console.error('Error generating snippets:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Regenerate a specific snippet
  const handleRegenerateSnippet = async (platform) => {
    if (!content.trim()) return;
    
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
      setSnippets(prev => ({
        ...prev,
        [platform]: data.snippet
      }));
    } catch (err) {
      console.error(`Error regenerating ${platform}:`, err);
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <form onSubmit={handleGenerateSnippets} className="mb-8">
        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Paste your article or blog post here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isLoading}
        />
        
        {error && (
          <div className="mt-2 text-red-500 text-sm">{error}</div>
        )}
        
        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-300"
          >
            {isLoading ? 'Generating...' : 'Generate Snippets'}
          </button>
        </div>
      </form>
      
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-gray-600">Generating your snippets...</p>
        </div>
      )}
      
      {snippets && !isLoading && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Social Snippets</h2>
          
          {Object.entries(snippets).map(([platform, snippet]) => (
            <EditableSnippet
              key={platform}
              platform={platform}
              snippet={snippet}
              onRegenerate={handleRegenerateSnippet}
            />
          ))}
        </div>
      )}
    </div>
  );
}