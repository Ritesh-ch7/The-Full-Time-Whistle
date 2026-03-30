export interface MediumArticle {
  id: string;
  slug: string;
  title: string;
  url: string;
  pubDate: string;
  rawDate: string;
  categories: string[];
  excerpt: string;
  content: string;
  thumbnail: string | null;
}

function formatDate(raw: string): string {
  try {
    return new Date(raw).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return raw;
  }
}

function parseItems(xml: string): MediumArticle[] {
  const items: MediumArticle[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let itemMatch;

  while ((itemMatch = itemRe.exec(xml)) !== null) {
    const block = itemMatch[1];

    const titleMatch = block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/);
    const title = titleMatch ? titleMatch[1].trim() : "";

    const linkMatch = block.match(/<link>(.*?)<\/link>/);
    const url = linkMatch
      ? linkMatch[1].replace(/\?source=rss[^"]*$/, "").trim()
      : "";

    const guidMatch = block.match(/<guid[^>]*>(.*?)<\/guid>/);
    const guid = guidMatch ? guidMatch[1].trim() : "";
    const slugMatch = guid.match(/\/p\/([a-zA-Z0-9]+)/);
    const id = slugMatch ? slugMatch[1] : Math.random().toString(36).slice(2);

    const dateMatch = block.match(/<pubDate>(.*?)<\/pubDate>/);
    const rawDate = dateMatch ? dateMatch[1].trim() : "";

    const catRe = /<category><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g;
    const categories: string[] = [];
    let catMatch;
    while ((catMatch = catRe.exec(block)) !== null) {
      categories.push(catMatch[1].trim());
    }

    const contentMatch = block.match(
      /<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/
    );
    const rawContent = contentMatch ? contentMatch[1] : "";
    // Strip Medium tracking pixel
    const content = rawContent
      .replace(/<img[^>]+width="1"[^>]*>/g, "")
      .trim();

    // First non-empty <p> text as excerpt
    const pRe = /<p[^>]*>([\s\S]*?)<\/p>/g;
    let excerpt = "";
    let pMatch;
    while ((pMatch = pRe.exec(content)) !== null) {
      const text = pMatch[1].replace(/<[^>]+>/g, "").trim();
      if (text.length > 20) {
        excerpt = text.length > 220 ? text.slice(0, 220) + "…" : text;
        break;
      }
    }

    // First <img> src as thumbnail
    const thumbMatch = content.match(/<img[^>]+src="([^"]+)"/);
    const thumbnail = thumbMatch ? thumbMatch[1] : null;

    if (title) {
      items.push({
        id,
        slug: id,
        title,
        url,
        pubDate: formatDate(rawDate),
        rawDate,
        categories,
        excerpt,
        content,
        thumbnail,
      });
    }
  }

  return items;
}

let cache: { articles: MediumArticle[]; fetchedAt: number } | null = null;

export async function getMediumArticles(): Promise<MediumArticle[]> {
  // In-memory cache: 1 hour
  if (cache && Date.now() - cache.fetchedAt < 3600_000) {
    return cache.articles;
  }
  try {
    const res = await fetch("https://medium.com/feed/@riteshchintakindi", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return cache?.articles ?? [];
    const xml = await res.text();
    const articles = parseItems(xml);
    cache = { articles, fetchedAt: Date.now() };
    return articles;
  } catch {
    return cache?.articles ?? [];
  }
}

export async function getMediumArticle(
  slug: string
): Promise<MediumArticle | null> {
  const articles = await getMediumArticles();
  return articles.find((a) => a.slug === slug) ?? null;
}

