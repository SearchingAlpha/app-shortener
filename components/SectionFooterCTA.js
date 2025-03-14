// components/SectionFooterCTA.jsx
import Link from 'next/link';

export default function SectionFooterCTA() {
  return (
    <section className="py-16 px-4 bg-blue-600 text-white text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Content?</h2>
        <p className="text-xl mb-8 opacity-90">Start turning your articles into platform-perfect social posts today.</p>
        <Link href="/generate" className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-lg transition-colors duration-200">
          Try It Now For Free
        </Link>
      </div>
    </section>
  );
}