'use client';

import { useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';

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
  
  // Check if text exceeds platform limits
  const isOverLimit = platform === 'x' && 
    parseInt(counter?.split('/')[0] || 0) > parseInt(counter?.split('/')[1] || 280);
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-500">Variant {variantNumber}</div>
        <div className={`text-sm ${isOverLimit ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
          {counter}
        </div>
      </div>
      
      <div
        className={`min-h-24 p-2 rounded transition-colors ${
          isEditing ? 'bg-blue-50 ring-1 ring-blue-300' : 'hover:bg-gray-50'
        }`}
        onClick={() => setIsEditing(true)}
        onBlur={() => setIsEditing(false)}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onInput={(e) => onEdit(e.currentTarget.textContent || '')}
        dangerouslySetInnerHTML={{ __html: text }}
      ></div>
      
      <div className="flex justify-end mt-2">
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="text-blue-600 text-sm flex items-center hover:text-blue-800 disabled:text-gray-400"
          aria-label="Regenerate snippet"
        >
          <FiRefreshCw className={`mr-1 ${isRegenerating ? 'animate-spin' : ''}`} />
          {isRegenerating ? 'Regenerating...' : 'Regenerate'}
        </button>
      </div>
    </div>
  );
}