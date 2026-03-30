import Link from "next/link";
import Image from "next/image";
import { getMediumArticles, type MediumArticle } from "@/lib/medium";

function ArticleCard({ article, index }: { article: MediumArticle; index: number }) {
  return (
    <Link
      href={`/press-box/${article.slug}`}
      className="group flex flex-col bg-[var(--color-concrete)] border border-[rgba(201,147,58,0.15)] rounded-sm overflow-hidden hover:border-[var(--color-gold)] transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Thumbnail */}
      {article.thumbnail && (
        <div className="relative w-full h-44 overflow-hidden bg-[var(--color-tunnel)]">
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
          {/* Gold gradient overlay at bottom */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(12,26,12,0.7) 0%, transparent 60%)" }} />
        </div>
      )}

      <div className="flex flex-col flex-1 p-6 gap-3">
        {/* Category tags */}
        {article.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.categories.slice(0, 3).map((cat) => (
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
        <h3 className="font-[var(--font-display)] text-xl text-[var(--color-chalk)] leading-snug group-hover:text-[var(--color-gold)] transition-colors duration-200">
          {article.title}
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="font-[var(--font-body)] text-sm text-[var(--color-text-secondary)] leading-relaxed flex-1 line-clamp-3">
            {article.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[rgba(201,147,58,0.1)] mt-auto">
          <time className="font-[var(--font-mono)] text-[11px] tracking-[0.12em] text-[var(--color-text-secondary)] uppercase">
            {article.pubDate}
          </time>
          <span className="font-[var(--font-mono)] text-xs text-[var(--color-gold)] group-hover:translate-x-1 transition-transform duration-200">
            Read Report →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function PressBox() {
  const articles = await getMediumArticles();

  return (
    <section
      id="press-box"
      className="relative min-h-screen bg-[var(--color-pitch)] px-6 py-24 overflow-hidden"
    >
      {/* Subtle floodlight glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,147,58,0.08) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-14">
          <p className="font-[var(--font-mono)] text-[11px] tracking-[0.4em] uppercase text-[var(--color-gold)] mb-4">
            Scene 07 — The Press Box
          </p>
          <h2 className="font-[var(--font-display)] text-5xl sm:text-7xl font-bold text-[var(--color-chalk)] tracking-tight leading-none mb-4">
            THE PRESS BOX
          </h2>
          <div className="h-px bg-[var(--color-gold)] opacity-25 max-w-xs mb-5" />
          <p className="font-[var(--font-body)] text-[var(--color-text-secondary)] text-base max-w-lg leading-relaxed">
            Dispatches from the press box. Articles on machine learning, data science, and the craft of building things — published on Medium.
          </p>
        </div>

        {/* Article grid */}
        {articles.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-[var(--font-display)] text-2xl text-[var(--color-text-secondary)] tracking-wide">
              The press box is quiet — check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {articles.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
        )}

        {/* View on Medium link */}
        {articles.length > 0 && (
          <div className="mt-12 text-center">
            <a
              href="https://medium.com/@riteshchintakindi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-[var(--font-mono)] text-xs tracking-[0.2em] uppercase text-[var(--color-text-secondary)] hover:text-[var(--color-gold)] transition-colors duration-200"
            >
              <span>All Articles on Medium</span>
              <span>↗</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

