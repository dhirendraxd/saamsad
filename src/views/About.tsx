"use client";

import { Link } from "@/lib/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Twitter, Linkedin, Github } from "lucide-react";

const team = [
  {
    name: "Arjun Sharma",
    role: "Co-founder & CEO",
    bio: "Worked in local governance before building civic tech tools. Focused on practical transparency.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=700&fit=crop&crop=face",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Priya Nair",
    role: "Head of Policy Research",
    bio: "Policy researcher focused on Nepal's federal system and public service delivery.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=700&fit=crop&crop=face",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Rohan Mehta",
    role: "Lead Engineer",
    bio: "Full-stack engineer working on reliable data flows and easy-to-use public dashboards.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=700&fit=crop&crop=face",
    twitter: "https://twitter.com",
    github: "https://github.com",
  },
  {
    name: "Sneha Patil",
    role: "Community Manager",
    bio: "Community organizer involved in voter literacy and local civic workshops.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=700&fit=crop&crop=face",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Kabir Das",
    role: "Data & Transparency Lead",
    bio: "RTI activist and data journalist helping shape how project promises are tracked.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=700&fit=crop&crop=face",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Meera Iyer",
    role: "UX & Product Design",
    bio: "Designs clear civic interfaces with experience from election-awareness campaigns in Nepal.",
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
                About Samsad
              </span>
              <h1 className="text-3xl md:text-[2.1rem] font-bold text-foreground leading-[1.2] tracking-tight mb-5">
                Built to hold power<br />accountable.
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                Samsad is an independent civic-tech platform that tracks promises,
                project progress, and governance performance across constituencies and municipalities in Nepal,
                so people can quickly understand what is moving and what is stuck.
              </p>

              {/* Stats strip */}
              <div className="flex flex-col gap-4 border-t border-border pt-6 mb-8">
                {[
                  ["1,200+", "Promises tracked"],
                  ["7", "Provinces covered"],
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
            <div className="flex-1 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 md:items-start">

              {/* Column 1 — offset down */}
              <div className="flex flex-col gap-10 md:mt-14">
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
              <div className="flex flex-col gap-10">
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
              <div className="flex flex-col gap-10 md:mt-8">
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
