// app/page.js
import SectionHero from '@/components/SectionHero';
import SectionFeatures from '@/components/SectionFeatures';
import SectionPricing from '@/components/SectionPricing';
import SectionFooterCTA from '@/components/SectionFooterCTA';

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full bg-white">
      <SectionHero />
      <SectionFeatures />
      <SectionPricing />
      <SectionFooterCTA />
    </main>
  );
}