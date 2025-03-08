'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import landImg from '@/public/landing.jpg';
import ButtonPrimary from '@/components/buttonPrimary';
import ButtonRegular from '@/components/buttonRegular';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-black px-4">
      <div className="bg-white p-12 rounded-lg shadow-lg text-center max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-black mb-4">
          Save time, increase your awareness.
        </h1>
        <p className="text-lg text-gray-600 mb-6" align="left">
        Enhance your short content creation with Shortener—because social media shouldn’t feel like pushing a rock uphill.        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ButtonPrimary onClick={() => router.push("/signup")}>Unlock Pro Access</ButtonPrimary>
          <ButtonRegular onClick={() => router.push("/dashboard")}>Start For Free</ButtonRegular>
        </div>

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
