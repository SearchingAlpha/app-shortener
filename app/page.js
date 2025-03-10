'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import landImg from '@/public/landing.jpg';
import ButtonPrimary from '@/components/buttonPrimary';
import ButtonRegular from '@/components/buttonRegular';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen text-black px-4 lg:px-16 gap-8">
      {/* Left Column: Image */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <Image 
          src={landImg} 
          alt="Landing Image" 
          className="rounded-lg shadow-lg w-full max-w-lg"
        />
      </div>

      {/* Right Column: Content */}
      <div className="w-full lg:w-1/2 bg-white p-8 rounded-lg shadow-lg text-center lg:text-left">
        <h1 className="text-4xl font-bold text-black mb-4">
          Save time, increase your awareness.
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Enhance your short content creation with Shortener—because social media shouldn’t feel like pushing a rock uphill.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <ButtonPrimary onClick={() => router.push("/signup")}>Unlock Pro Access</ButtonPrimary>
          <ButtonRegular onClick={() => router.push("/learn-more")}>Learn More</ButtonRegular>
        </div>
      </div>
    </div>
  );
}
