import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mockEducationTopics } from "@/data/mockData";
import { BookOpen, Clock } from "lucide-react";

const categories = ["All", "Democracy Basics", "Local Government", "Elections", "Public Budgeting", "Citizen Rights"];

const CivicEducation = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? mockEducationTopics
    : mockEducationTopics.filter((t) => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <div className="max-w-3xl mb-10">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Civic Education Hub</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            Learn How Governance Works
          </h1>
          <p className="text-muted-foreground">
            A civic knowledge library designed to help every citizen understand democracy, governance, and their rights.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((topic) => (
            <div
              key={topic.id}
              className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-lg transition-all cursor-pointer border border-transparent hover:border-accent/20 group"
            >
              <span className="text-3xl mb-4 block">{topic.icon}</span>
              <span className="text-[10px] uppercase tracking-wider text-accent font-semibold">{topic.category}</span>
              <h3 className="font-bold text-lg text-foreground mt-1 mb-2 group-hover:text-accent transition-colors">{topic.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{topic.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{topic.readTime}</span>
                <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />Article</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CivicEducation;
