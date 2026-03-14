const stats = [
  { value: "48K+", label: "Citizens registered across hundreds of wards", color: "text-foreground" },
  { value: "73%", label: "Promises verified through community moderation", color: "text-civic-slate" },
  { value: "2M+", label: "Evidence uploads shared on the platform", color: "text-accent" },
];

const StatsSection = () => {
  return (
    <section className="border-t bg-card" id="about">
      <div className="container py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight text-foreground">
            Behind Every Promise, a Story of Accountability
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            CivicLedger began with a simple idea — to create a transparent space
            for citizens and politicians to build trust through verifiable
            actions. Every number here represents real community participation
            in governance oversight.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div key={stat.value} className="bg-muted rounded-2xl p-8 animate-count-up">
              <p className={`text-5xl md:text-6xl font-extrabold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
