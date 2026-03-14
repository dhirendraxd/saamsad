const steps = [
  {
    step: "01",
    title: "Register & Verify",
    description: "Citizens register with their National ID. Politicians are automatically verified against election commission data.",
  },
  {
    step: "02",
    title: "Publish Promises",
    description: "Verified politicians publish manifestos which are converted into trackable projects with timelines and milestones.",
  },
  {
    step: "03",
    title: "Community Verifies",
    description: "Citizens in each ward review progress, upload evidence, and collectively confirm whether promises are being kept.",
  },
  {
    step: "04",
    title: "Scores Build Trust",
    description: "Accountability and transparency scores emerge from real citizen participation — creating a public governance record.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-extrabold">
            From Promise to Public Record
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item) => (
            <div key={item.step} className="relative">
              <span className="text-6xl font-extrabold text-primary-foreground/10">{item.step}</span>
              <h3 className="font-bold text-lg mt-2">{item.title}</h3>
              <p className="text-sm text-primary-foreground/70 mt-2 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
