import { useState } from "react";
import { mockPoliticians } from "@/data/mockData";
import PoliticianCard from "@/components/PoliticianCard";
import PoliticianPanel from "@/components/PoliticianPanel";
import type { Politician } from "@/data/mockData";

const FeaturedPoliticians = () => {
  const [selected, setSelected] = useState<Politician | null>(null);
  const featured = mockPoliticians.slice(0, 3);

  return (
    <section className="bg-background" id="politicians">
      <div className="container py-16 md:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Featured Politicians</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Leaders Under the Spotlight
            </h2>
          </div>
          <a href="/explore" className="text-sm font-medium text-accent hover:underline hidden md:block">
            View all →
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p) => (
            <PoliticianCard key={p.id} politician={p} onClick={() => setSelected(p)} />
          ))}
        </div>
      </div>

      {selected && <PoliticianPanel politician={selected} onClose={() => setSelected(null)} />}
    </section>
  );
};

export default FeaturedPoliticians;
