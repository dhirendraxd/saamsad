import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Twitter, Linkedin, Github } from "lucide-react";

const team = [
  {
    name: "Arjun Sharma",
    role: "Co-founder & CEO",
    bio: "Former IAS officer turned civic-tech builder. Believes transparency is the foundation of democracy.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=700&fit=crop&crop=face",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Priya Nair",
    role: "Head of Policy Research",
    bio: "Political scientist with 8 years studying Indian governance. Turns policy into plain language.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=700&fit=crop&crop=face",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Rohan Mehta",
    role: "Lead Engineer",
    bio: "Full-stack engineer obsessed with data pipelines and making civic data accessible to everyone.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=700&fit=crop&crop=face",
    twitter: "https://twitter.com",
    github: "https://github.com",
  },
  {
    name: "Sneha Patil",
    role: "Community Manager",
    bio: "Grassroots organiser who has run voter literacy drives in 12 states.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=700&fit=crop&crop=face",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Kabir Das",
    role: "Data & Transparency Lead",
    bio: "RTI activist and data journalist. Built the promise-tracking model at the core of CivicLedger.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=700&fit=crop&crop=face",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Meera Iyer",
    role: "UX & Product Design",
    bio: "Designs civic interfaces that feel as natural as a conversation. Previously at ECI.",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=700&fit=crop&crop=face",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero + Team (merged) ───────────────────────── */}
      <section className="border-b border-border">
        <div className="container py-16 md:py-24 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-start gap-16">

            {/* Left: mission + stats + cta */}
            <div className="md:w-72 shrink-0 md:sticky md:top-24">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">
                About CivicLedger
              </span>
              <h1 className="text-3xl md:text-[2.1rem] font-bold text-foreground leading-[1.2] tracking-tight mb-5">
                Built to hold power<br />accountable.
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                CivicLedger is an independent civic-tech platform tracking political promises,
                government projects, and governance performance across every ward, municipality,
                and constituency — so every citizen sees exactly what their representatives are doing.
              </p>

              {/* Stats strip */}
              <div className="flex flex-col gap-4 border-t border-border pt-6 mb-8">
                {[
                  ["1,200+", "Promises tracked"],
                  ["28", "States covered"],
                  ["4,000+", "Verified citizens"],
                ].map(([num, label]) => (
                  <div key={label} className="flex items-baseline gap-3">
                    <span className="text-xl font-bold text-foreground tabular-nums">{num}</span>
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/auth"
                className="text-xs text-muted-foreground hover:text-[#1DA1F2] transition-colors"
              >
                Join our team →
              </Link>
            </div>

            {/* Right: staggered 3-column photo grid */}
            <div className="flex-1 flex gap-8 items-start">

              {/* Column 1 — offset down */}
              <div className="flex flex-col gap-10 flex-1 mt-14">
                {[team[0], team[3]].map((person) => (
                  <div key={person.name} className="group">
                    <div className="overflow-hidden">
                      <img
                        src={person.img}
                        alt={person.name}
                        className="w-full h-64 object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                    <div className="pt-3.5 pb-2 border-b border-transparent group-hover:border-border transition-colors duration-300">
                      <p className="font-semibold text-sm text-foreground">{person.name}</p>
                      <p className="text-[11px] text-accent mt-0.5 mb-2 tracking-wide">{person.role}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{person.bio}</p>
                      <div className="flex gap-2.5">
                        {person.twitter && (
                          <a href={person.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#1DA1F2] transition-colors">
                            <Twitter className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {person.linkedin && (
                          <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#1DA1F2] transition-colors">
                            <Linkedin className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {person.github && (
                          <a href={person.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#1DA1F2] transition-colors">
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Column 2 — starts at top */}
              <div className="flex flex-col gap-10 flex-1">
                {[team[1], team[4]].map((person) => (
                  <div key={person.name} className="group">
                    <div className="overflow-hidden">
                      <img
                        src={person.img}
                        alt={person.name}
                        className="w-full h-64 object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                    <div className="pt-3.5 pb-2 border-b border-transparent group-hover:border-border transition-colors duration-300">
                      <p className="font-semibold text-sm text-foreground">{person.name}</p>
                      <p className="text-[11px] text-accent mt-0.5 mb-2 tracking-wide">{person.role}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{person.bio}</p>
                      <div className="flex gap-2.5">
                        {person.twitter && (
                          <a href={person.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#1DA1F2] transition-colors">
                            <Twitter className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {person.linkedin && (
                          <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#1DA1F2] transition-colors">
                            <Linkedin className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {person.github && (
                          <a href={person.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#1DA1F2] transition-colors">
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Column 3 — slight offset */}
              <div className="flex flex-col gap-10 flex-1 mt-8">
                {[team[2], team[5]].map((person) => (
                  <div key={person.name} className="group">
                    <div className="overflow-hidden">
                      <img
                        src={person.img}
                        alt={person.name}
                        className="w-full h-64 object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                    <div className="pt-3.5 pb-2 border-b border-transparent group-hover:border-border transition-colors duration-300">
                      <p className="font-semibold text-sm text-foreground">{person.name}</p>
                      <p className="text-[11px] text-accent mt-0.5 mb-2 tracking-wide">{person.role}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{person.bio}</p>
                      <div className="flex gap-2.5">
                        {person.twitter && (
                          <a href={person.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#1DA1F2] transition-colors">
                            <Twitter className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {person.linkedin && (
                          <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#1DA1F2] transition-colors">
                            <Linkedin className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {person.github && (
                          <a href={person.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#1DA1F2] transition-colors">
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
