import Fuse from "fuse.js";
import { laureates, YEAR_MIN, YEAR_MAX } from "./laureates";
import type { ExploreFilters, NobelCategory, NobelLaureate } from "../types/nobel";
import { CATEGORIES } from "../types/nobel";

/** Normalize for diacritic-insensitive matching. */
export function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

interface SearchDoc extends NobelLaureate {
  nameNorm: string;
  kwNorm: string[];
  blob: string;
}

const docs: SearchDoc[] = laureates.map((l) => ({
  ...l,
  nameNorm: norm(l.name),
  kwNorm: l.keywords.map(norm),
  blob: norm(
    [
      ...l.awards.map((a) => `${a.year} ${a.category} ${a.motivation}`),
      l.country ?? "",
      l.type,
    ].join(" "),
  ),
}));

const fuse = new Fuse(docs, {
  keys: [
    { name: "nameNorm", weight: 0.5 },
    { name: "kwNorm", weight: 0.28 },
    { name: "blob", weight: 0.22 },
  ],
  threshold: 0.38,
  ignoreLocation: true,
  includeScore: true,
  minMatchCharLength: 2,
});

// ---------------------------------------------------------------- parsing --
const CATEGORY_WORDS: { words: string[]; category: NobelCategory }[] = [
  { words: ["physics", "fisica", "física", "fisico", "físico"], category: "Physics" },
  { words: ["chemistry", "quimica", "química", "quimico", "químico"], category: "Chemistry" },
  { words: ["medicine", "medicina", "medico", "médico", "physiology", "fisiologia", "fisiología"], category: "Physiology or Medicine" },
  { words: ["literature", "literatura", "literario"], category: "Literature" },
  { words: ["peace", "paz", "pacifico"], category: "Peace" },
  { words: ["economics", "economia", "economía", "economico", "económico", "economic"], category: "Economic Sciences" },
];

export interface ParsedQuery {
  text: string;
  year: number | null;
  decade: number | null;
  category: NobelCategory | null;
}

/** Extract structured hints (year, decade, category) from free text. Deterministic, no LLM. */
export function parseQuery(q: string): ParsedQuery {
  const n = norm(q);
  let text = n;
  let year: number | null = null;
  let decade: number | null = null;
  let category: NobelCategory | null = null;

  const decadeMatch = n.match(/\b(19\d|20[0-2])0'?s\b/) ?? n.match(/\baños\s?(19\d|20[0-2])0\b/);
  if (decadeMatch) {
    decade = parseInt(decadeMatch[1], 10) * 10;
    text = text.replace(decadeMatch[0], " ");
  } else {
    const yearMatch = n.match(/\b(19\d{2}|20[0-2]\d)\b/);
    if (yearMatch) {
      const y = parseInt(yearMatch[1], 10);
      if (y >= YEAR_MIN && y <= YEAR_MAX) {
        year = y;
        text = text.replace(yearMatch[0], " ");
      }
    }
  }

  for (const cw of CATEGORY_WORDS) {
    for (const w of cw.words) {
      if (text.split(/\s+/).includes(w)) {
        category = cw.category;
        text = text.replace(new RegExp(`\\b${w}\\b`, "g"), " ");
        break;
      }
    }
    if (category) break;
  }

  text = text.replace(/\s+/g, " ").trim();
  return { text, year, decade, category };
}

// ---------------------------------------------------------------- search ---
export interface SearchResult {
  laureate: NobelLaureate;
  score: number;
}

function matchesFilters(l: NobelLaureate, f: ExploreFilters): boolean {
  if (f.category !== "all" && !l.awards.some((a) => a.category === f.category)) return false;
  if (f.kind !== "all" && l.type !== f.kind) return false;
  if (f.country && l.country !== f.country) return false;
  const years = l.awards.map((a) => a.year);
  if (f.decade != null) {
    if (!years.some((y) => y >= f.decade! && y < f.decade! + 10)) return false;
  } else {
    if (f.from != null && !years.some((y) => y >= f.from!)) return false;
    if (f.to != null && !years.some((y) => y <= f.to!)) return false;
  }
  return true;
}

export function searchLaureates(filters: ExploreFilters): SearchResult[] {
  const parsed = parseQuery(filters.q);
  const effCategory = filters.category !== "all" ? filters.category : parsed.category;
  const effFilters: ExploreFilters = { ...filters, category: effCategory ?? "all" };

  let pool: SearchDoc[] = docs.filter((l) => matchesFilters(l, effFilters));

  if (parsed.year != null) {
    pool = pool.filter((l) => l.awards.some((a) => a.year === parsed.year));
  }
  if (parsed.decade != null) {
    pool = pool.filter((l) => l.awards.some((a) => a.year >= parsed.decade! && a.year < parsed.decade! + 10));
  }

  if (!parsed.text) {
    // No free text: return structured results, newest first.
    return pool
      .map((laureate) => ({ laureate, score: 1 }))
      .sort((a, b) => Math.max(...b.laureate.awards.map((x) => x.year)) - Math.max(...a.laureate.awards.map((x) => x.year)));
  }

  const hits = fuse.search(parsed.text, { limit: 400 });
  const poolIds = new Set(pool.map((l) => l.id));
  const qn = norm(parsed.text);
  const ranked = hits
    .filter((h) => poolIds.has(h.item.id))
    .map((h) => {
      let boost = 0;
      if (h.item.nameNorm.startsWith(qn)) boost -= 0.25;
      else if (h.item.nameNorm.includes(qn)) boost -= 0.12;
      return { laureate: h.item as NobelLaureate, score: (h.score ?? 1) + boost };
    })
    .sort((a, b) => a.score - b.score);
  return ranked;
}

// ------------------------------------------------------------ autocomplete --
export interface Suggestion {
  kind: "laureate" | "topic" | "hint";
  label: string;
  sub?: string;
  laureate?: NobelLaureate;
  query?: string;
}

/** Fast suggestions for the command-style autocomplete panel. */
export function suggest(query: string, limit = 8): Suggestion[] {
  const qn = norm(query);
  if (qn.length < 2) return [];
  const out: Suggestion[] = [];

  // Laureate name matches (prefix first).
  const starts: NobelLaureate[] = [];
  const contains: NobelLaureate[] = [];
  for (const l of laureates) {
    const n = norm(l.name);
    if (n.startsWith(qn)) starts.push(l);
    else if (n.includes(qn)) contains.push(l);
    if (starts.length + contains.length > 40) break;
  }
  const nameHits = [...starts, ...contains].slice(0, 5);
  for (const l of nameHits) {
    const first = l.awards[0];
    out.push({
      kind: "laureate",
      label: l.name,
      sub: `${first.category} · ${first.year}`,
      laureate: l,
    });
  }

  // Topic matches from keyword tags.
  const seen = new Set<string>();
  for (const l of laureates) {
    for (const k of l.keywords) {
      const kn = norm(k);
      if (kn.includes(qn) && !seen.has(kn)) {
        seen.add(kn);
        out.push({ kind: "topic", label: k, query: k });
        if (out.length >= limit) break;
      }
    }
    if (out.length >= limit) break;
  }

  // Parsed structured hint (e.g. "physics 1921").
  const parsed = parseQuery(query);
  if ((parsed.year || parsed.decade || parsed.category) && out.length < limit) {
    const bits: string[] = [];
    if (parsed.category) bits.push(parsed.category);
    if (parsed.year) bits.push(String(parsed.year));
    if (parsed.decade) bits.push(`${parsed.decade}s`);
    out.push({ kind: "hint", label: bits.join(" · "), query });
  }

  return out.slice(0, limit);
}

export { CATEGORIES };
