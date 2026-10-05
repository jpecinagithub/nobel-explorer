import raw from "../data/laureates.json";
import meta from "../data/meta.json";
import type { NobelCategory, NobelLaureate } from "../types/nobel";
import { CATEGORIES } from "../types/nobel";

export const laureates: NobelLaureate[] = raw as NobelLaureate[];

export const YEAR_MIN = meta.yearMin as number;
export const YEAR_MAX = meta.yearMax as number;

const bySlug = new Map<string, NobelLaureate>();
const byId = new Map<string, NobelLaureate>();
for (const l of laureates) {
  bySlug.set(l.slug, l);
  byId.set(l.id, l);
}

export function getLaureateBySlug(slug: string): NobelLaureate | undefined {
  return bySlug.get(slug);
}

export function getLaureateById(id: string): NobelLaureate | undefined {
  return byId.get(id);
}

/** All awards flattened, newest first — useful for stats. */
export interface AwardEntry {
  laureate: NobelLaureate;
  year: number;
  category: NobelCategory;
  motivation: string;
  shared: boolean;
}

export const allAwards: AwardEntry[] = laureates
  .flatMap((l) =>
    l.awards.map((a) => ({
      laureate: l,
      year: a.year,
      category: a.category,
      motivation: a.motivation,
      shared: a.shared,
    })),
  )
  .sort((a, b) => b.year - a.year || a.category.localeCompare(b.category));

export function awardsByYear(year: number): AwardEntry[] {
  return allAwards.filter((a) => a.year === year);
}

export function laureatesByCategory(category: NobelCategory): NobelLaureate[] {
  return laureates
    .filter((l) => l.awards.some((a) => a.category === category))
    .sort(
      (a, b) =>
        Math.min(...a.awards.map((x) => x.year)) -
        Math.min(...b.awards.map((x) => x.year)),
    );
}

export function countByCategory(category: NobelCategory): number {
  return laureates.filter((l) => l.awards.some((a) => a.category === category)).length;
}

export function topCountries(limit = 12): { country: string; count: number }[] {
  const m = new Map<string, number>();
  for (const l of laureates) {
    if (l.country) m.set(l.country, (m.get(l.country) ?? 0) + 1);
  }
  return [...m.entries()]
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function allCountries(): string[] {
  const s = new Set<string>();
  for (const l of laureates) if (l.country) s.add(l.country);
  return [...s].sort((a, b) => a.localeCompare(b));
}

export function womenLaureates(): NobelLaureate[] {
  return laureates.filter((l) => l.gender === "female");
}

export function multiAwardLaureates(): NobelLaureate[] {
  return laureates.filter((l) => l.awards.length > 1);
}

export function famousLaureates(): NobelLaureate[] {
  // Curated rotating set of widely recognized names present in the index.
  const names = [
    "Albert Einstein",
    "Marie Curie",
    "Nelson Mandela",
    "Martin Luther King Jr.",
    "Malala Yousafzai",
    "Ernest Hemingway",
    "Gabriel García Márquez",
    "Bob Dylan",
    "Mother Teresa",
    "Winston Churchill",
    "Alexander Fleming",
    "James Watson",
    "Francis Crick",
    "Niels Bohr",
    "Max Planck",
    "Richard Feynman",
    "Tu Youyou",
    "Jennifer A. Doudna",
    "Emmanuelle Charpentier",
    "Geoffrey Hinton",
    "John Hopfield",
    "Katalin Karikó",
    "Amartya Sen",
    "Daniel Kahneman",
    "Elinor Ostrom",
    "Muhammad Yunus",
    "Pablo Neruda",
    "Toni Morrison",
    "Kazuo Ishiguro",
    "Mario Vargas Llosa",
    "Barack Obama",
    "Aung San Suu Kyi",
    "Kofi Annan",
    "Albert Schweitzer",
    "Linus Pauling",
    "John Bardeen",
    "Marie Skłodowska-Curie",
  ];
  const found = names
    .map((n) => laureates.find((l) => l.name === n))
    .filter((l): l is NobelLaureate => !!l);
  return found;
}

export function randomLaureate(exceptSlug?: string): NobelLaureate {
  const pool = exceptSlug ? laureates.filter((l) => l.slug !== exceptSlug) : laureates;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function categoryOfSlug(slug: string | undefined): NobelCategory | null {
  if (!slug) return null;
  const found = CATEGORIES.find(
    (c) => c.toLowerCase().replace(/[^a-z]/g, "") === slug.toLowerCase().replace(/[^a-z]/g, ""),
  );
  return found ?? null;
}

/** First / latest award year for a category. */
export function categoryRange(category: NobelCategory): { first: number; latest: number } {
  const years = allAwards.filter((a) => a.category === category).map((a) => a.year);
  return { first: Math.min(...years), latest: Math.max(...years) };
}
