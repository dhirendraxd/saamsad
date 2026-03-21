import { useMemo } from "react";
import { Link } from "@/lib/router";
import type { Politician } from "@/lib/api/contracts";
import { usePoliticiansQuery } from "@/hooks/queries/useCivicQueries";

interface FeaturedPoliticiansProps {
  limit?: number;
  politiciansOverride?: Politician[];
}

interface FeaturedPoliticianView {
  id: string;
  name: string;
  ward: string;
  party: string;
  accountabilityScore: number;
  completionRate: number;
  verified: boolean;
}

function toFeaturedPoliticianView(politician: Politician): FeaturedPoliticianView {
  // Backend integration seam:
  // map/normalize API response fields here without changing presentation markup.
  const completionRate = Math.round(
    (politician.completedPromises / Math.max(politician.totalPromises, 1)) * 100,
  );

  return {
    id: politician.id,
    name: politician.name,
    ward: politician.ward,
    party: politician.party,
    accountabilityScore: politician.accountabilityScore,
    completionRate,
    verified: politician.verified,
  };
}

const FeaturedPoliticians = ({ limit = 3, politiciansOverride }: FeaturedPoliticiansProps) => {
  const { data: politicians = [], isLoading, isError, refetch } = usePoliticiansQuery();
  const hasOverride = Array.isArray(politiciansOverride);
  const source = hasOverride ? politiciansOverride : politicians;

  const featured = useMemo(
    () =>
      source
        .map(toFeaturedPoliticianView)
        .sort((left, right) => right.accountabilityScore - left.accountabilityScore)
        .slice(0, Math.max(limit, 1)),
    [limit, source],
  );

  return (
    <section className="bg-background" id="politicians">
      <div className="container py-16 md:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-civic-slate font-semibold text-sm uppercase tracking-wider mb-2">Featured Politicians</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Highest Accountability Scores
            </h2>
          </div>
          <Link
            to="/explore"
            className="hidden text-sm font-medium text-foreground transition-colors hover:text-twitter-blue md:block"
          >
            View all →
          </Link>
        </div>

        {isLoading && !hasOverride ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-live="polite">
            {Array.from({ length: limit }).map((_, index) => (
              <article key={`featured-politician-skeleton-${index}`} className="surface-line pt-6">
                <div className="h-3 w-20 bg-muted" />
                <div className="mt-3 h-5 w-40 bg-muted" />
                <div className="mt-2 h-4 w-28 bg-muted" />
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-4">
                  <div>
                    <div className="h-7 w-14 bg-muted" />
                    <div className="mt-2 h-3 w-16 bg-muted" />
                  </div>
                  <div>
                    <div className="h-7 w-14 bg-muted" />
                    <div className="mt-2 h-3 w-14 bg-muted" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : isError && !hasOverride ? (
          <div className="surface-line py-6 text-sm text-muted-foreground">
            <p className="text-foreground">Could not load featured politicians right now.</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-2 border-b border-border text-xs font-medium text-muted-foreground transition-colors hover:text-twitter-blue"
            >
              Try again
            </button>
          </div>
        ) : featured.length === 0 ? (
          <div className="surface-line py-6 text-sm text-muted-foreground">
            No featured politicians available yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((politician, index) => (
              <article key={politician.id} className="surface-line pt-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-civic-slate">{politician.ward}</p>
                  <span className="text-[10px] text-muted-foreground">#{index + 1}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground">{politician.name}</h3>
                  {politician.verified && (
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-twitter-blue text-[9px] text-white">
                      ✓
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-civic-slate">{politician.party}</p>
                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4">
                  <div>
                    <p className="text-2xl font-extrabold text-civic-green">{politician.accountabilityScore}%</p>
                    <p className="text-xs text-civic-slate">Accountability</p>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-foreground">{politician.completionRate}%</p>
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
