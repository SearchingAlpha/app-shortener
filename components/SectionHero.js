// components/SectionHero.jsx
import Link from 'next/link';

export default function SectionHero() {
  return (
    <section className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="text-center max-w-[800px] mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          Turn Your Long-Form Content Into Social Gold
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-10">
          Paste your text, get platform-ready snippets in seconds.
        </p>
        <Link 
          href="/transform" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
        >
          Try It Now
        </Link>
      </div>
    </section>
  );
}