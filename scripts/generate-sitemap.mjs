#!/usr/bin/env node
/** Build-time sitemap generator. Reads the Nobel index and writes public/sitemap.xml. */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://nobel-explorer.app";

const laureates = JSON.parse(readFileSync(join(root, "src/data/laureates.json"), "utf-8"));

const staticRoutes = [
  "/",
  "/explore",
  "/discover",
  "/categories",
  "/category/physics",
  "/category/chemistry",
  "/category/medicine",
  "/category/literature",
  "/category/peace",
  "/category/economics",
  "/years",
  "/history",
  "/alfred-nobel",
  "/author",
  "/statistics",
  "/sources",
];

const yearRoutes = [];
const years = new Set();
for (const l of laureates) for (const a of l.awards) years.add(a.year);
for (const y of [...years].sort((a, b) => a - b)) yearRoutes.push(`/year/${y}`);

const laureateRoutes = laureates.map((l) => `/laureate/${l.slug}`);

const urls = [...staticRoutes, ...yearRoutes, ...laureateRoutes]
  .map((p) => `  <url><loc>${SITE}${p}</loc><changefreq>monthly</changefreq></url>`)
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
writeFileSync(join(root, "public/sitemap.xml"), xml);
console.log(`sitemap.xml written: ${staticRoutes.length + yearRoutes.length + laureateRoutes.length} urls`);
