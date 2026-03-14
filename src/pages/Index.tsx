import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturedPoliticians from "@/components/FeaturedPoliticians";
import RecentProjects from "@/components/RecentProjects";
import CtaSection from "@/components/CtaSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="homepage-vibe">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <FeaturedPoliticians />
        <RecentProjects />
        <CtaSection />
      </main>
    </div>
  );
};

export default Index;
