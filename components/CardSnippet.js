'use client';

import { useState } from 'react';
import { ClipboardCopy, RotateCw } from 'lucide-react';

function CardSnippet({ 
  platform, 
  text, 
  counter, 
  isRegenerating, 
  onEdit, 
  onRegenerate,
  variantNumber
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [isCopied, setIsCopied] = useState(false);
  
  const handleEditClick = () => {
    setIsEditing(true);
    setEditedText(text);
  };
  
  const handleSave = () => {
    onEdit(editedText);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditedText(text);
  };
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      <div className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700">Variant {variantNumber}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">{counter}</span>
          
          <button
            onClick={handleCopy}
            className="p-1 rounded-md hover:bg-gray-200 transition-colors"
            title="Copy to clipboard"
          >
            <ClipboardCopy size={16} className="text-gray-600" />
          </button>
          
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="p-1 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
            title="Regenerate"
          >
            <RotateCw size={16} className={`text-gray-600 ${isRegenerating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      <div className="p-3">
        {isEditing ? (
          <div>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isRegenerating}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                disabled={isRegenerating}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={isRegenerating}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={handleEditClick}
            className="min-h-[100px] cursor-text whitespace-pre-wrap break-words text-gray-800"
          >
            {isRegenerating ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <span className="mr-2">Regenerating</span>
                <span className="inline-block animate-pulse">...</span>
              </div>
            ) : (
              text
            )}
          </div>
        )}
      </div>
      
      {isCopied && (
        <div className="absolute top-0 right-0 m-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
          Copied!
        </div>
      )}
    </div>
  );
}

export default CardSnippet;