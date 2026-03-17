import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useEducationTopicsQuery } from "@/hooks/queries/useCivicQueries";
import civicIllustration from "@/assets/civic-education-illustration.png";
import federalismImg from "@/assets/fedeeralism new.jpg";
import digitalRightsImg from "@/assets/digital new .jpg";
import corruptionImg from "@/assets/corruption.jpg";
import electoralSystemImg from "@/assets/electoral system.jpg";

const categories = ["All", "Local Governance", "Digital Rights", "Anti-Corruption", "Electoral System"];
const titleAccentClasses = ["text-[#5B5BD6]", "text-[#F2A93B]", "text-[#2FB5C4]", "text-[#7A3A30]"];
const courseActionLabels = ["Let's Explore", "Let's Learn", "Let's Start"];
const courseImagesById: Record<string, string> = {
  e1: federalismImg,
  e2: digitalRightsImg,
  e3: corruptionImg,
  e4: electoralSystemImg,
};

const CivicEducation = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: educationTopics = [], isLoading } = useEducationTopicsQuery();

  const filtered = activeCategory === "All"
    ? educationTopics
    : educationTopics.filter((topic) => topic.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <div className="flex flex-col md:flex-row md:items-center gap-8 mb-10">
          <div className="flex-1 max-w-2xl">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Civic Education Hub</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
              Learn How Governance Works
            </h1>
            <p className="text-muted-foreground">
              A civic knowledge library designed to help every citizen understand democracy, governance, and their rights.
            </p>
          </div>
          <div className="flex-shrink-0 md:w-64 lg:w-80">
            <img
              src={civicIllustration}
              alt="Diplomatic and political illustration"
              className="w-full opacity-90"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-8 flex flex-wrap gap-x-6 gap-y-3 border-b border-border pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`tab-link py-2 ${
                activeCategory === cat
                  ? "border-foreground text-foreground"
                  : "text-muted-foreground hover:text-twitter-blue"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        {isLoading ? (
          <div className="surface-line py-6 text-sm text-muted-foreground">Loading civic education topics...</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((topic, index) => {
              const [lead, ...rest] = topic.title.split(" ");
              const cardImage = courseImagesById[topic.id] ?? civicIllustration;
              const actionLabel = courseActionLabels[index % courseActionLabels.length];

              return (
                <article key={topic.id} className="flex h-full w-full flex-col border border-[#e5e5e5] bg-white p-5">
                  <div className="mb-5 flex h-56 items-center justify-center sm:h-60 md:h-64 lg:h-56 xl:h-64">
                    <img
                      src={cardImage}
                      alt={`${topic.title} course illustration`}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  <h3 className="mb-2 min-h-[3.4rem] text-center text-[1.12rem] font-semibold leading-tight text-[#202020]">
                    <span className="inline-block">
                      <span className={titleAccentClasses[index % titleAccentClasses.length]}>{lead}</span>
                      {rest.length > 0 ? <span className="text-[#202020]"> {rest.join(" ")}</span> : null}
                    </span>
                  </h3>

                  <p className="mb-5 min-h-[3.6rem] text-center text-[13px] leading-6 text-[#6f6f6f]">{topic.description}</p>

                  <button
                    type="button"
                    aria-label={`Open ${topic.title} course`}
                    className="mt-auto w-full rounded-none border border-[#d9d9d9] bg-white py-2.5 text-[14px] font-semibold text-[#2b2b2b] transition-colors hover:border-[#bfbfbf] hover:text-[#1DA1F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1DA1F2]/35"
                  >
                    {actionLabel}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CivicEducation;
