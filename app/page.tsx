import HeroSplit from "@/components/HeroSplit";
import SocialProofStrip from "@/components/SocialProofStrip";
import HowItWorks from "@/components/HowItWorks";
import TrackerSpotlight from "@/components/TrackerSpotlight";
import MapSpotlight from "@/components/MapSpotlight";
import FeatureGrid from "@/components/FeatureGrid";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="bg-[#f6f7f9] text-slate-900">
      <main>
        {/* Hero */}
        <section className="bg-white">
          <HeroSplit />
        </section>

        {/* Social proof */}
        <section className="bg-white border-t border-slate-200">
          <SocialProofStrip />
        </section>

        {/* How it works */}
        <section className="bg-[#f6f7f9]">
          <HowItWorks />
        </section>

        {/* Tracker spotlight */}
        <section className="bg-white">
          <TrackerSpotlight />
        </section>

        {/* Map spotlight */}
        <section className="bg-[#f6f7f9]">
          <MapSpotlight />
        </section>

        {/* Features */}
        <section className="bg-white">
          <FeatureGrid />
        </section>

        {/* Final CTA */}
        <section className="bg-white border-t border-slate-200">
          <FinalCTA />
        </section>
      </main>

      <Footer />
    </div>
  );
}
