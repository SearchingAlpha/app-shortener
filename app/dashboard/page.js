'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import ButtonPrimary from '@/components/buttonPrimary';

export default function Dashboard() {
  const [text, setText] = useState('');
  const [summaries, setSummaries] = useState([]);
  const inputRef = useRef(null);

  const defaultPrompt = "Summarize the following text into multiple shorter publications.";

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollTop = inputRef.current.scrollHeight;
    }
  }, [text]);

  async function handleSummarize() {
    if (!text.trim()) return;
    
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, prompt: defaultPrompt }),
      });

      if (!response.ok) throw new Error('Failed to fetch summaries');
      
      const data = await response.json();
      setSummaries(data.summaries || []);
    } catch (error) {
      console.error('Error summarizing text:', error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 space-y-4">
      <h1 className="text-2xl font-bold">Text Summarizer</h1>
      
      {/* Long Text Input */}
      <textarea
        ref={inputRef}
        placeholder="Enter your long text here..."
        className="w-full max-w-2xl p-3 text-lg outline-none border rounded-lg resize-none overflow-y-auto h-48"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Summarize Button */}
      <ButtonPrimary onClick={handleSummarize}>
        <ArrowUp className="h-5"/>
      </ButtonPrimary>

      {/* Display Summaries */}
      <div className="w-full max-w-2xl space-y-4">
        {summaries.map((summary, index) => (
          <div key={index} className="p-3 bg-white shadow rounded-lg">
            <p className="text-gray-800">{summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}