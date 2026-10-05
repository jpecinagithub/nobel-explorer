import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../components/Seo";
import SearchBar from "../components/SearchBar";
import LaureateCard from "../components/LaureateCard";
import FilterBar from "../components/FilterBar";
import { EmptyState } from "../components/EmptyState";
import { useReader } from "../components/ReaderContext";
import type { ExploreFilters, NobelCategory } from "../types/nobel";
import { CATEGORIES } from "../types/nobel";
import { searchLaureates } from "../lib/search";
import { YEAR_MIN, YEAR_MAX } from "../lib/laureates";

const PAGE_SIZE = 24;

function parseParams(sp: URLSearchParams): ExploreFilters {
  const cat = sp.get("category");
  const category: NobelCategory | "all" =
    cat && (CATEGORIES as string[]).includes(cat) ? (cat as NobelCategory) : "all";
  const num = (v: string | null) => (v && /^\d+$/.test(v) ? Number(v) : null);
  const kind = sp.get("kind");
  return {
    q: sp.get("q") ?? "",
    category,
    from: num(sp.get("from")),
    to: num(sp.get("to")),
    decade: num(sp.get("decade")),
    country: sp.get("country"),
    kind: kind === "person" || kind === "organization" ? kind : "all",
  };
}

function toParams(f: ExploreFilters): URLSearchParams {
  const sp = new URLSearchParams();
  if (f.q) sp.set("q", f.q);
  if (f.category !== "all") sp.set("category", f.category);
  if (f.from != null) sp.set("from", String(f.from));
  if (f.to != null) sp.set("to", String(f.to));
  if (f.decade != null) sp.set("decade", String(f.decade));
  if (f.country) sp.set("country", f.country);
  if (f.kind !== "all") sp.set("kind", f.kind);
  return sp;
}

const DEFAULTS: ExploreFilters = {
  q: "",
  category: "all",
  from: null,
  to: null,
  decade: null,
  country: null,
  kind: "all",
};

export default function Explore() {
  const { t } = useTranslation();
  const [sp, setSp] = useSearchParams();
  const { openLaureate } = useReader();
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filters = useMemo(() => parseParams(sp), [sp]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [sp]);

  const results = useMemo(() => searchLaureates(filters), [filters]);

  const update = (f: ExploreFilters) => {
    // Clamp year range.
    const from = f.from != null ? Math.max(YEAR_MIN, Math.min(YEAR_MAX, f.from)) : null;
    const to = f.to != null ? Math.max(YEAR_MIN, Math.min(YEAR_MAX, f.to)) : null;
    setSp(toParams({ ...f, from, to }), { replace: true });
  };

  const clear = () => setSp(new URLSearchParams(), { replace: true });

  return (
    <>
      <Seo
        title={t("nav.explore")}
        path={`/explore${sp.toString() ? `?${sp.toString()}` : ""}`}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-6">{t("explore.title")}</h1>

        <div className="mb-5 max-w-2xl">
          <SearchBar
            initialValue={filters.q}
            key={filters.q}
            onSelectLaureate={openLaureate}
          />
        </div>

        <FilterBar filters={filters} onChange={update} resultCount={results.length} />

        {results.length === 0 ? (
          <EmptyState onClear={clear} />
        ) : (
          <>
            <p className="text-sm text-muted mb-4" aria-live="polite">
              {t("explore.subtitle", { count: results.length.toLocaleString() })}
              {filters.q && (
                <>
                  {" · "}
                  <button onClick={clear} className="text-gold-deep hover:underline font-medium">
                    {t("explore.clearFilters")}
                  </button>
                </>
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.slice(0, visible).map((r) => (
                <LaureateCard key={r.laureate.slug} laureate={r.laureate} onOpen={openLaureate} />
              ))}
            </div>
            {visible < results.length && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="px-8 py-3 rounded-full border border-line bg-white text-sm font-medium hover:border-gold transition-colors"
                >
                  {t("common.viewAll")} ({(results.length - visible).toLocaleString()})
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export { DEFAULTS };
