const stats = [
  { value: "500+", label: "Projects tracked with public timelines", color: "text-civic-slate" },
  { value: "1,200+", label: "Evidence uploads and citizen comments logged", color: "text-civic-slate" },
  { value: "85%", label: "Community confirmations marked as in-progress or completed", color: "text-civic-amber" },
];

const StatsSection = () => {
  return (
    <section className="bg-background" id="about">
      <div className="container py-16 md:py-24 space-y-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight text-foreground">
            Public Accountability, Measured in Real Signals
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-xl">
            CivicLedger turns campaign promises into trackable records. These numbers reflect real project updates,
            evidence uploads, and citizen verification activity across wards.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.value} className="surface-line pt-6 animate-count-up">
              <p className={`text-5xl md:text-6xl font-extrabold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
