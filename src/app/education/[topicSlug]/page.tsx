import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { educationTopicDetails, getEducationTopicBySlug } from "@/lib/educationTopics";

interface EducationTopicPageProps {
  params: Promise<{
    topicSlug: string;
  }>;
}

export async function generateStaticParams() {
  return educationTopicDetails.map((topic) => ({ topicSlug: topic.slug }));
}

export async function generateMetadata({ params }: EducationTopicPageProps): Promise<Metadata> {
  const { topicSlug } = await params;
  const topic = getEducationTopicBySlug(topicSlug);

  if (!topic) {
    return {
      title: "Education Topic Not Found",
    };
  }

  return {
    title: `${topic.title} | Civic Education`,
    description: topic.summary,
  };
}

export default async function EducationTopicPage({ params }: EducationTopicPageProps) {
  const { topicSlug } = await params;
  const topic = getEducationTopicBySlug(topicSlug);

  if (!topic) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-10">
        <div className="mb-8 border-b border-border pb-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">Civic Education</p>
          <h1 className="mb-3 text-3xl font-extrabold text-foreground md:text-4xl">{topic.title}</h1>
          <p className="max-w-3xl text-muted-foreground">{topic.summary}</p>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span>Category: {topic.category}</span>
            <span>Read time: {topic.readTime}</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          <section className="space-y-8">
            {topic.sections.map((section) => (
              <article key={section.heading} className="border-l-2 border-border pl-5">
                <h2 className="mb-3 text-xl font-semibold text-foreground">{section.heading}</h2>
                <ul className="space-y-3 text-muted-foreground">
                  {section.points.map((point) => (
                    <li key={point} className="leading-7">
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </section>

          <aside className="h-fit border border-border p-5">
            <h2 className="mb-3 text-lg font-semibold text-foreground">What You Can Do Next</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {topic.citizenActions.map((action) => (
                <li key={action} className="leading-6">
                  {action}
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-border pt-4">
              <Link
                href="/education"
                className="inline-flex w-full items-center justify-center rounded-none border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:text-[#1DA1F2]"
              >
                Back to Education Hub
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}