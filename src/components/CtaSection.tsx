import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";

const CtaSection = () => {
  return (
    <section className="bg-background" id="education">
      <div className="container py-16 md:py-24">
        <div className="surface-band mx-auto max-w-2xl p-10 text-center md:p-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-civic-slate">Civic Education</p>
          <h2 className="mb-4 text-3xl font-extrabold text-foreground md:text-4xl">
            Learn Governance Basics
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
            Short practical guides on institutions, rights, and public accountability.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="civic" size="lg" className="rounded-none" asChild>
              <Link to="/education">Start Learning</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
