const features = [
  {
    title: "Promise Tracking",
    description: "Turn manifestos into public projects with visible progress.",
  },
  {
    title: "Citizen Verification",
    description: "Residents confirm status updates with evidence from the ground.",
  },
  {
    title: "Transparency Records",
    description: "Disclosures and reports stay visible in one public timeline.",
  },
  {
    title: "Civic Education",
    description: "Simple learning paths explain institutions, rights, and process.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-background" id="projects">
      <div className="container py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-civic-slate">Platform Features</p>
          <h2 className="text-3xl font-extrabold text-foreground md:text-4xl">
            Built for Clear Public Oversight
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="rounded-none border border-border bg-card p-6 shadow-card transition-colors hover:bg-muted/35"
            >
              <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-civic-slate">0{index + 1}</p>
              <h3 className="mb-2 text-lg font-bold text-foreground">{feature.title}</h3>
              <div className="my-3 h-px w-full bg-border" />
              <p className="text-sm leading-relaxed text-civic-slate">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
