import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-civic.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight text-foreground">
              Hold Power{" "}
              <span className="text-accent">Accountable,</span>{" "}
              Build Trust Together
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              A community-moderated platform where politicians publish promises
              and citizens verify progress — creating a transparent public ledger
              of governance performance.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="civic" size="lg">
                Get Started
              </Button>
              <Button variant="civic-outline" size="lg">
                Explore Projects
              </Button>
            </div>
          </div>

          {/* Right — image + floating stats */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-card-lg">
              <img
                src={heroImage}
                alt="Citizens engaging in civic governance discussion"
                className="w-full h-auto object-cover aspect-square"
                loading="eager"
              />
            </div>

            {/* Floating badge top-right */}
            <div className="absolute -top-3 -right-3 md:top-4 md:-right-6 bg-accent text-accent-foreground px-4 py-2 rounded-full text-xs font-semibold shadow-lg animate-fade-up">
              Track every promise
            </div>

            {/* Floating stat card */}
            <div className="absolute bottom-6 -left-4 md:-left-8 bg-card rounded-xl p-4 shadow-card-lg animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <p className="text-2xl font-extrabold text-civic-green">85%</p>
              <p className="text-xs text-muted-foreground">of promises tracked</p>
            </div>

            {/* Floating badges bottom */}
            <div className="absolute bottom-24 left-6 md:left-2 space-y-2 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <div className="bg-card rounded-lg px-3 py-1.5 shadow-card text-xs font-medium">
                Join <span className="text-accent font-bold">1,000+</span> citizens
              </div>
              <div className="bg-card rounded-lg px-3 py-1.5 shadow-card text-xs font-medium">
                <span className="text-accent font-bold">500+</span> projects monitored
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
