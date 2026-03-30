import { getMediumArticle, getMediumArticles } from "@/lib/medium";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const articles = await getMediumArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getMediumArticle(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title} | The Press Box`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await getMediumArticle(slug);
  if (!article) notFound();

  return (
    <main className="min-h-screen bg-[var(--color-pitch)] pt-20 pb-24 px-6">
      {/* Back link */}
      <div className="max-w-3xl mx-auto mb-10">
        <Link
          href="/#press-box"
          className="inline-flex items-center gap-2 font-[var(--font-mono)] text-xs tracking-[0.2em] uppercase text-[var(--color-text-secondary)] hover:text-[var(--color-gold)] transition-colors duration-200"
        >
          ← Back to Press Box
        </Link>
      </div>

      <article className="max-w-3xl mx-auto">
        {/* Category tags */}
        {article.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {article.categories.map((cat) => (
              <span
                key={cat}
                className="font-[var(--font-mono)] text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-sm text-[var(--color-gold)] bg-[rgba(201,147,58,0.1)] border border-[rgba(201,147,58,0.2)]"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="font-[var(--font-display)] text-4xl sm:text-6xl font-bold text-[var(--color-chalk)] leading-tight mb-4">
          {article.title}
        </h1>

        {/* Byline */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[rgba(201,147,58,0.2)]">
          <time className="font-[var(--font-mono)] text-sm text-[var(--color-text-secondary)]">
            {article.pubDate}
          </time>
          <span className="text-[var(--color-text-secondary)] opacity-30">·</span>
          <span className="font-[var(--font-mono)] text-sm text-[var(--color-text-secondary)]">
            Ritesh Chintakindi
          </span>
        </div>

        {/* Article body */}
        <div
          className="press-prose"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Footer — link to Medium */}
        <div className="mt-16 pt-8 border-t border-[rgba(201,147,58,0.2)]">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-[var(--font-mono)] text-xs tracking-[0.2em] uppercase text-[var(--color-text-secondary)] hover:text-[var(--color-gold)] transition-colors duration-200"
          >
            Read on Medium ↗
          </a>
        </div>
      </article>
    </main>
  );
}

