import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroPrimary from "@/assets/hero-illustration-primary.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container py-20 md:py-28 lg:py-32">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] md:gap-12 lg:gap-10 xl:gap-16">
          {/* Left */}
          <div className="space-y-5 md:max-w-xl lg:pr-4">
            <h1 className="max-w-[12ch] text-[clamp(2.9rem,7vw,4.25rem)] font-bold leading-[0.98] tracking-tight text-foreground">
              <span className="block whitespace-nowrap">Track Promises.</span>
              <span className="block whitespace-nowrap">Verify Progress.</span>
            </h1>
            <p className="max-w-md text-base text-muted-foreground md:text-lg">
              CivicLedger turns public promises into trackable projects with updates, evidence, and citizen review.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="civic" size="lg" className="rounded-none" asChild>
                <Link to="/explore">Explore</Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-none" asChild>
                <Link to="/regions">Regions</Link>
              </Button>
            </div>
          </div>

          {/* Right — illustration */}
          <div className="relative flex justify-center md:justify-end md:-mr-6 lg:-mr-10 xl:-mr-12">
            <div className="relative w-full max-w-[30rem] sm:max-w-[34rem] md:max-w-[42rem] md:-translate-y-2 lg:max-w-[50rem] lg:-translate-y-4 xl:max-w-[54rem]">
              <img
                src={heroPrimary}
                alt="Civic participation illustration"
                className="block w-full h-auto object-contain"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
