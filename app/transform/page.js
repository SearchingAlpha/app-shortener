// app/transform/page.jsx
import React from 'react';
import { Suspense } from 'react';
import ContentTransformer from '@/components/ContentTransformer';
import PageLoading from '@/components/PageLoading';

export const metadata = {
  title: 'Transform Your Content',
  description: 'Turn your long-form content into platform-ready snippets in seconds',
};

export default function TransformPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Transform Your Content
        </h1>
        
        <Suspense fallback={<PageLoading />}>
          <ContentTransformer />
        </Suspense>
      </div>
    </main>
  );
}