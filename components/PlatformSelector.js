'use client';

export default function PlatformSelector({ selectedPlatforms, onPlatformChange }) {
  const platforms = [
    { id: 'x', name: 'X (Twitter)', icon: 'X' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'in' },
    { id: 'instagram', name: 'Instagram', icon: 'IG' },
    { id: 'facebook', name: 'Facebook', icon: 'FB' },
    { id: 'substack', name: 'Substack', icon: 'SB' }
  ];
  
  return (
    <div className="flex flex-wrap gap-3">
      {platforms.map(platform => (
        <label 
          key={platform.id}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all
            ${selectedPlatforms[platform.id] 
              ? 'bg-blue-100 border-blue-300 text-blue-800' 
              : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'}
            border
          `}
        >
          <input
            type="checkbox"
            className="sr-only"
            checked={selectedPlatforms[platform.id]}
            onChange={(e) => onPlatformChange(platform.id, e.target.checked)}
          />
          
          <div 
            className={`
              w-6 h-6 flex items-center justify-center text-xs font-bold rounded
              ${selectedPlatforms[platform.id] ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}
            `}
          >
            {platform.icon}
          </div>
          
          <span className="font-medium">{platform.name}</span>
          
          {selectedPlatforms[platform.id] && (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 text-blue-600" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          )}
        </label>
      ))}
    </div>
  );
}