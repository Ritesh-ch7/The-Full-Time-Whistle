/**
 * sync-linkedin.mjs
 *
 * Fetches Ritesh's LinkedIn profile via Proxycurl and writes career.json.
 * Run locally:  PROXYCURL_API_KEY=xxx node scripts/sync-linkedin.mjs
 * Run in CI:    Triggered weekly by .github/workflows/sync-career.yml
 *
 * Sign up for a free Proxycurl key at https://nubela.co/proxycurl
 * Store it as a GitHub secret named PROXYCURL_API_KEY.
 */

import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const LINKEDIN_URL = "https://www.linkedin.com/in/ritesh-chintakindi-9b03a223b/";
const API_KEY = process.env.PROXYCURL_API_KEY;
const OUT_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../data/career.json");

if (!API_KEY) {
  console.error("❌  PROXYCURL_API_KEY not set. Export it before running.");
  process.exit(1);
}

/* ─── Helpers ────────────────────────────────────────────────────────── */
function formatPeriod(start, end) {
  if (!start) return "";
  const s = `${start.month ?? ""}/${start.year}`.replace(/^\//, "");
  const e = end ? `${end.month ?? ""}/${end.year}`.replace(/^\//, "") : "Present";
  return `${start.year} – ${end ? end.year : "Present"}`;
}

function badgeForExperience(index, startYear) {
  return `SIGNED · ${startYear ?? "—"}`;
}

function descriptionFallback(item) {
  if (item.description) return item.description.slice(0, 200);
  return `Playing a key role at ${item.company ?? item.school}. Delivering consistent performances across every challenge.`;
}

/* ─── Fetch ──────────────────────────────────────────────────────────── */
async function fetchProfile() {
  const url = new URL("https://nubela.co/proxycurl/api/v2/linkedin");
  url.searchParams.set("linkedin_profile_url", LINKEDIN_URL);
  url.searchParams.set("extra", "exclude");
  url.searchParams.set("skills", "exclude");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`❌  Proxycurl returned ${res.status}: ${body}`);
    process.exit(1);
  }
  return res.json();
}

/* ─── Transform ──────────────────────────────────────────────────────── */
function transformProfile(profile) {
  const entries = [];

  // Education (oldest → newest, shown first = "Pre-Season / Academy")
  const edu = (profile.education ?? []).slice().reverse();
  edu.forEach((e, i) => {
    entries.push({
      id: `edu-${String(i + 1).padStart(2, "0")}`,
      type: "education",
      institution: e.school ?? "University",
      role: [e.degree_name, e.field_of_study].filter(Boolean).join(" · ") || "Degree",
      period: formatPeriod(e.starts_at, e.ends_at),
      season: "Pre-Season",
      badge: `ACADEMY · ${e.starts_at?.year ?? "—"}`,
      description: descriptionFallback(e),
    });
  });

  // Experience (oldest → newest, feels like walking forward)
  const exp = (profile.experiences ?? []).slice().reverse();
  exp.forEach((e, i) => {
    entries.push({
      id: `exp-${String(i + 1).padStart(2, "0")}`,
      type: "experience",
      institution: e.company ?? "Company",
      role: e.title ?? "Engineer",
      period: formatPeriod(e.starts_at, e.ends_at),
      season: e.ends_at ? "Previous Club" : "First Team",
      badge: badgeForExperience(i, e.starts_at?.year),
      description: descriptionFallback(e),
    });
  });

  return entries;
}

/* ─── Main ───────────────────────────────────────────────────────────── */
(async () => {
  console.log("⏳  Fetching LinkedIn profile…");
  const profile = await fetchProfile();
  console.log(`✅  Got profile for: ${profile.full_name}`);

  const career = transformProfile(profile);
  writeFileSync(OUT_PATH, JSON.stringify(career, null, 2) + "\n", "utf8");
  console.log(`📝  Wrote ${career.length} entries to data/career.json`);
})();

