import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroPrimary from "@/assets/hero-illustration-primary.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container py-20 md:py-32 lg:py-40 xl:py-44">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-10 lg:gap-12 xl:gap-12">
          {/* Left */}
          <div className="relative z-20 max-w-[30rem] space-y-5 lg:max-w-[32rem] lg:pr-8 xl:max-w-[34rem] xl:pr-12">
            <div className="space-y-3">
              <h1 className="flex flex-col items-start gap-1 tracking-tight">
                <span className="whitespace-nowrap text-[clamp(2.55rem,5.1vw,4.45rem)] font-bold leading-[0.98] text-foreground">
                  Track Promises.
                </span>
                <span className="whitespace-nowrap text-[clamp(1.9rem,3.7vw,3.05rem)] font-bold leading-[1.02] text-muted-foreground">
                  Verify Progress.
                </span>
              </h1>
            </div>
            <p className="max-w-[28rem] text-base leading-relaxed text-muted-foreground md:text-[1.02rem]">
              CivicLedger turns public promises into trackable projects with updates, evidence, and citizen review.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button variant="civic" size="lg" className="rounded-none" asChild>
                <Link to="/explore">Explore</Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-none" asChild>
                <Link to="/regions">Regions</Link>
              </Button>
            </div>
          </div>

          {/* Right — illustration */}
          <div className="relative z-0 flex justify-center md:justify-end md:-mr-14 lg:-mr-28 xl:-mr-36">
            <div className="relative w-full max-w-[30rem] sm:max-w-[40rem] md:max-w-[61rem] md:-translate-y-2 lg:max-w-[75rem] lg:-translate-y-5 xl:max-w-[82rem]">
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
