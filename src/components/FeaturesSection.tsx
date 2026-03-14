import { Shield, Users, FileCheck, GraduationCap, MapPin, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Promise Tracking",
    description: "Every manifesto promise becomes a trackable project with status updates, evidence, and community verification.",
  },
  {
    icon: Users,
    title: "Community Moderation",
    description: "No central moderators — citizens collectively verify project progress through confirmations and evidence uploads.",
  },
  {
    icon: FileCheck,
    title: "Transparency Documents",
    description: "Politicians earn trust by sharing expenditure reports, asset declarations, and governance documents.",
  },
  {
    icon: GraduationCap,
    title: "Civic Education Hub",
    description: "Learn how government works, understand citizen rights, and explore political ideologies from multiple perspectives.",
  },
  {
    icon: MapPin,
    title: "Ward-Based Engagement",
    description: "Citizens interact within their own ward while freely exploring projects and politicians across the entire country.",
  },
  {
    icon: BarChart3,
    title: "Reputation Scores",
    description: "Public accountability scores built from completed promises, citizen trust ratings, and engagement metrics.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-background" id="projects">
      <div className="container py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">Platform Features</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Everything You Need for Civic Oversight
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-card-lg transition-shadow border border-transparent hover:border-accent/20"
            >
              <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
