'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import ButtonPrimary from '@/components/buttonPrimary';

export default function Dashboard() {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollTop = inputRef.current.scrollHeight;
    }
  }, [message]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      {/* Chat Input Box */}
      <div className="w-full max-w-2xl flex items-center bg-white shadow-lg rounded-xl p-4 relative">
        <textarea
          ref={inputRef}
          placeholder="Type a message..."
          className="w-full p-2 text-lg outline-none border-none bg-transparent resize-none overflow-y-auto max-h-60 h-48"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ lineHeight: '1.5rem' }} // Adjusts line height for better spacing
        />
        {/* Floating Send Button */}
        
        <button
          className="absolute right-4 bottom-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all"
        >
          <ArrowUp size={24} />
        </button>
      </div>
    </div>
  );
}
