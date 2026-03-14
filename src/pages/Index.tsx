import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import FeaturedPoliticians from "@/components/FeaturedPoliticians";
import RecentProjects from "@/components/RecentProjects";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturedPoliticians />
      <RecentProjects />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
