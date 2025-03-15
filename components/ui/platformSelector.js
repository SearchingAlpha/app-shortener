'use client';

import { FiTwitter, FiLinkedin, FiInstagram, FiFacebook } from 'react-icons/fi';
import { RiSubtractFill } from 'react-icons/ri';

export default function PlatformSelector({ selectedPlatforms, onPlatformChange }) {
  const platforms = [
    { id: 'x', name: 'X (Twitter)', icon: <FiTwitter className="w-5 h-5" /> },
    { id: 'linkedin', name: 'LinkedIn', icon: <FiLinkedin className="w-5 h-5" /> },
    { id: 'instagram', name: 'Instagram', icon: <FiInstagram className="w-5 h-5" /> },
    { id: 'facebook', name: 'Facebook', icon: <FiFacebook className="w-5 h-5" /> },
    { id: 'substack', name: 'Substack', icon: <RiSubtractFill className="w-5 h-5" /> }
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {platforms.map((platform) => (
        <button
          key={platform.id}
          type="button"
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedPlatforms[platform.id]
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onPlatformChange(platform.id, !selectedPlatforms[platform.id])}
        >
          {platform.icon}
          <span>{platform.name}</span>
        </button>
      ))}
    </div>
  );
}