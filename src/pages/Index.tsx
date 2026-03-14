import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import FeaturedPoliticians from "@/components/FeaturedPoliticians";
import RecentProjects from "@/components/RecentProjects";
import CtaSection from "@/components/CtaSection";
import { useAuth } from "@/lib/auth/useAuth";

const HOMEPAGE_VISIT_COUNT_STORAGE_KEY = "civic-ledger-homepage-visit-count";
const FEATURED_POLITICIANS_MIN_VISITS = 3;

function getStoredHomepageVisitCount() {
  if (typeof window === "undefined") {
    return 0;
  }

  const rawCount = window.localStorage.getItem(HOMEPAGE_VISIT_COUNT_STORAGE_KEY);
  const parsedCount = Number.parseInt(rawCount ?? "0", 10);
  return Number.isFinite(parsedCount) && parsedCount > 0 ? parsedCount : 0;
}

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [homepageVisitCount, setHomepageVisitCount] = useState<number>(() => getStoredHomepageVisitCount());

  useEffect(() => {
    const nextVisitCount = getStoredHomepageVisitCount() + 1;
    window.localStorage.setItem(HOMEPAGE_VISIT_COUNT_STORAGE_KEY, String(nextVisitCount));
    setHomepageVisitCount(nextVisitCount);
  }, []);

  const showFeaturedPoliticians = useMemo(
    () => homepageVisitCount >= FEATURED_POLITICIANS_MIN_VISITS,
    [homepageVisitCount],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="homepage-vibe">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        {showFeaturedPoliticians && <FeaturedPoliticians />}
        {isAuthenticated && <RecentProjects />}
        <CtaSection />
      </main>
    </div>
  );
};

export default Index;
