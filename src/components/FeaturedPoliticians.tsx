import { useMemo } from "react";
import { Link } from "react-router-dom";
import { usePoliticiansQuery } from "@/hooks/queries/useCivicQueries";

const FeaturedPoliticians = () => {
  const { data: politicians = [], isLoading } = usePoliticiansQuery();

  const featured = useMemo(
    () => [...politicians].sort((left, right) => right.accountabilityScore - left.accountabilityScore).slice(0, 3),
    [politicians],
  );

  return (
    <section className="bg-background" id="politicians">
      <div className="container py-16 md:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-civic-slate font-semibold text-sm uppercase tracking-wider mb-2">Featured Politicians</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Top Accountability Leaders
            </h2>
          </div>
          <Link
            to="/explore"
            className="hidden text-sm font-medium text-foreground transition-colors hover:text-twitter-blue md:block"
          >
            View all →
          </Link>
        </div>

        {isLoading ? (
          <div className="surface-line py-6 text-sm text-muted-foreground">
            Loading featured politicians...
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((politician) => (
              <article key={politician.id} className="surface-line pt-6">
                <p className="text-xs uppercase tracking-[0.16em] text-civic-slate">{politician.ward}</p>
                <h3 className="mt-2 text-lg font-bold text-foreground">{politician.name}</h3>
                <p className="mt-1 text-sm text-civic-slate">{politician.party}</p>
                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4">
                  <div>
                    <p className="text-2xl font-extrabold text-civic-green">{politician.accountabilityScore}%</p>
                    <p className="text-xs text-civic-slate">Accountability</p>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-foreground">
                      {Math.round((politician.completedPromises / Math.max(politician.totalPromises, 1)) * 100)}%
                    </p>
                    <p className="text-xs text-civic-slate">Completion</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedPoliticians;
