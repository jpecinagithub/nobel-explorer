export type NobelCategory =
  | "Physics"
  | "Chemistry"
  | "Physiology or Medicine"
  | "Literature"
  | "Peace"
  | "Economic Sciences";

export interface NobelAward {
  year: number;
  category: NobelCategory;
  motivation: string;
  shared: boolean;
}

export interface NobelLaureate {
  id: string;
  slug: string;
  name: string;
  type: "person" | "organization";
  awards: NobelAward[];
  wiki?: string; // English Wikipedia title
  birthYear?: number;
  deathYear?: number;
  foundedYear?: number;
  country?: string;
  gender?: "male" | "female";
  keywords: string[];
  image?: string;
}

export interface ExploreFilters {
  q: string;
  category: NobelCategory | "all";
  from: number | null;
  to: number | null;
  decade: number | null;
  country: string | null;
  kind: "all" | "person" | "organization";
}

export const CATEGORIES: NobelCategory[] = [
  "Physics",
  "Chemistry",
  "Physiology or Medicine",
  "Literature",
  "Peace",
  "Economic Sciences",
];

export const CATEGORY_SLUG: Record<NobelCategory, string> = {
  Physics: "physics",
  Chemistry: "chemistry",
  "Physiology or Medicine": "medicine",
  Literature: "literature",
  Peace: "peace",
  "Economic Sciences": "economics",
};

export const SLUG_CATEGORY: Record<string, NobelCategory> = {
  physics: "Physics",
  chemistry: "Chemistry",
  medicine: "Physiology or Medicine",
  literature: "Literature",
  peace: "Peace",
  economics: "Economic Sciences",
};
