'use client';

import { useState, useRef, useEffect } from 'react';

export default function CardSnippet({ 
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
  const textareaRef = useRef(null);
  
  // When text prop changes, update editedText state
  useEffect(() => {
    setEditedText(text);
  }, [text]);
  
  // Auto-focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);
  
  function handleStartEditing() {
    setIsEditing(true);
  }
  
  function handleSaveEdit() {
    onEdit(editedText);
    setIsEditing(false);
  }
  
  function handleTextareaChange(e) {
    setEditedText(e.target.value);
  }
  
  function handleKeyDown(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSaveEdit();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedText(text); // Reset to original when canceling
    }
  }
  
  // Platform display names
  const platformNames = {
    x: 'X Post',
    linkedin: 'LinkedIn Post',
    instagram: 'Instagram Caption',
    substack: 'Substack Note'
  };
  
  return (
    <div className="relative border border-gray-200 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full">
            {variantNumber}
          </span>
          <h3 className="font-semibold text-gray-800">
            Option {variantNumber}
          </h3>
        </div>
        <span className="text-xs text-gray-500">{counter}</span>
      </div>
      
      <div className="min-h-[80px]">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] text-gray-700"
            value={editedText}
            onChange={handleTextareaChange}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <div 
            className="p-2 text-gray-700 rounded cursor-text min-h-[80px]"
            onClick={handleStartEditing}
          >
            {text}
          </div>
        )}
      </div>
      
      <div className="flex justify-end mt-3">
        <button
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onRegenerate}
          disabled={isRegenerating}
        >
          {isRegenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Regenerating...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Regenerate
            </>
          )}
        </button>
      </div>
    </div>
  );
}