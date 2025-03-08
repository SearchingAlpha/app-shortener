'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import landImg from '@/public/landing.jpg';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="bg-gray-800 p-12 rounded-lg shadow-lg text-center max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to Your App
        </h1>
        <p className="text-lg text-gray-400 mb-6">
          A minimalistic app designed to enhance your experience.
        </p>
        <button
          onClick={() => router.push('/signup')}
          className="px-6 py-3 bg-gray-700 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-black transition"
        >
          Get Started
        </button>
        <div className="mt-10">
          <Image
            src={landImg}
            alt="App preview"
            width={500}
            height={300}
            className="rounded-lg shadow-lg mx-auto"
          />
        </div>
      </div>
      <footer className="absolute bottom-5 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>
    </div>
  );
}
