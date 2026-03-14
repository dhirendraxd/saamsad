const steps = [
  {
    step: "01",
    title: "Register & Verify",
    description: "Create an account and confirm identity details.",
  },
  {
    step: "02",
    title: "Publish Promises",
    description: "Promises are converted into trackable public projects.",
  },
  {
    step: "03",
    title: "Community Verifies",
    description: "Residents review progress and submit local evidence.",
  },
  {
    step: "04",
    title: "Scores Build Trust",
    description: "Performance scores update from measurable activity.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="border-y border-border bg-muted/35">
      <div className="container py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-civic-slate font-semibold text-sm uppercase tracking-wider mb-3">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            From Promise to Public Record
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item) => (
            <div key={item.step} className="rounded-2xl border border-border bg-background p-6 shadow-card">
              <span className="text-5xl font-extrabold text-foreground/12">{item.step}</span>
              <h3 className="mt-3 text-lg font-bold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
