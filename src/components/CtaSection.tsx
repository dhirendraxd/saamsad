import { Button } from "@/components/ui/button";

const CtaSection = () => {
  return (
    <section className="bg-background" id="education">
      <div className="container py-16 md:py-24">
        <div className="bg-muted rounded-3xl p-10 md:p-16 text-center max-w-3xl mx-auto">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">Civic Education</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Learn How Governance Works
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Access learning paths on government structures, citizen rights,
            election systems, and local development — all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="civic" size="lg">Start Learning</Button>
            <Button variant="civic-outline" size="lg">Browse Topics</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
