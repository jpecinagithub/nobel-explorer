import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../components/Seo";
import LaureateCard from "../components/LaureateCard";
import { useReader } from "../components/ReaderContext";
import type { NobelLaureate } from "../types/nobel";
import { laureates, womenLaureates, multiAwardLaureates, famousLaureates } from "../lib/laureates";
import { searchLaureates } from "../lib/search";
import { DEFAULTS } from "./Explore";

interface Collection {
  key: string;
  title: string;
  get: () => NobelLaureate[];
  exploreQuery?: string;
}

export default function Discover() {
  const { t } = useTranslation();
  const { openLaureate } = useReader();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const collections: Collection[] = useMemo(
    () => [
      { key: "famous", title: t("discover.famous"), get: () => famousLaureates() },
      { key: "women", title: t("discover.women"), get: () => womenLaureates() },
      { key: "multiple", title: t("discover.multiple"), get: () => multiAwardLaureates() },
      {
        key: "organizations",
        title: t("discover.organizations"),
        get: () => laureates.filter((l) => l.type === "organization"),
        exploreQuery: undefined,
      },
      { key: "quantum", title: t("discover.quantum"), get: () => searchLaureates({ ...DEFAULTS, q: "quantum physics" }).slice(0, 12).map((r) => r.laureate), exploreQuery: "quantum physics" },
      { key: "genetics", title: t("discover.genetics"), get: () => searchLaureates({ ...DEFAULTS, q: "DNA genetics" }).slice(0, 12).map((r) => r.laureate), exploreQuery: "DNA" },
      { key: "ai", title: t("discover.ai"), get: () => searchLaureates({ ...DEFAULTS, q: "artificial intelligence" }).slice(0, 12).map((r) => r.laureate), exploreQuery: "artificial intelligence" },
      { key: "cancer", title: t("discover.cancer"), get: () => searchLaureates({ ...DEFAULTS, q: "cancer research" }).slice(0, 12).map((r) => r.laureate), exploreQuery: "cancer" },
      { key: "humanRights", title: t("discover.humanRights"), get: () => searchLaureates({ ...DEFAULTS, q: "human rights" }).slice(0, 12).map((r) => r.laureate), exploreQuery: "human rights" },
      { key: "peace", title: t("discover.peace"), get: () => searchLaureates({ ...DEFAULTS, category: "Peace" }).slice(0, 12).map((r) => r.laureate), exploreQuery: undefined },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  );

  const toggle = (key: string) =>
    setExpanded((s) => {
      const n = new Set(s);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });

  return (
    <>
      <Seo title={t("home.collectionsTitle")} path="/discover" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-2">{t("home.collectionsTitle")}</h1>
        <p className="text-muted mb-10">{t("home.discoverSubtitle")}</p>

        {collections.map((c) => {
          const items = c.get();
          const isOpen = expanded.has(c.key);
          const shown = isOpen ? items : items.slice(0, 6);
          return (
            <section key={c.key} className="mb-12">
              <div className="flex items-end justify-between mb-4">
                <h2 className="font-serif text-2xl font-semibold">
                  {c.title} <span className="text-base text-muted font-sans font-normal">· {items.length}</span>
                </h2>
                {c.exploreQuery ? (
                  <Link
                    to={`/explore?q=${encodeURIComponent(c.exploreQuery)}`}
                    className="text-sm font-medium text-gold-deep hover:underline shrink-0"
                  >
                    {t("common.viewAll")}
                  </Link>
                ) : (
                  items.length > 6 && (
                    <button
                      onClick={() => toggle(c.key)}
                      className="text-sm font-medium text-gold-deep hover:underline shrink-0"
                      aria-expanded={isOpen}
                    >
                      {isOpen ? t("common.close") : t("common.viewAll")}
                    </button>
                  )
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {shown.map((l) => (
                  <LaureateCard key={l.slug} laureate={l} onOpen={openLaureate} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
