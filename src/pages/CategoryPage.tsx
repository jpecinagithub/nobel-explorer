import { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../components/Seo";
import LaureateCard from "../components/LaureateCard";
import { useReader } from "../components/ReaderContext";
import { CATEGORY_ICONS, SearchIcon, ArrowRightIcon } from "../components/icons";
import { CATEGORIES, CATEGORY_SLUG, SLUG_CATEGORY, type NobelCategory } from "../types/nobel";
import { laureatesByCategory, categoryRange, countByCategory } from "../lib/laureates";
import { trackEvent } from "../lib/analytics";

export function CategoriesPage() {
  const { t } = useTranslation();
  return (
    <>
      <Seo title={t("nav.categories")} path="/categories" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-2">{t("nav.categories")}</h1>
        <p className="text-muted mb-8">{t("home.categoriesSubtitle")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICONS[c];
            const count = countByCategory(c);
            return (
              <Link
                key={c}
                to={`/category/${CATEGORY_SLUG[c]}`}
                className="group bg-white border border-line rounded-xl p-6 hover:shadow-lg hover:border-gold/50 hover:-translate-y-0.5 transition-all"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-soft text-gold-deep mb-4 group-hover:bg-gold group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </span>
                <h2 className="font-serif text-xl font-semibold">{t(`categories.${c}` as never)}</h2>
                <p className="text-sm text-gold-deep font-semibold mt-1">
                  {count} {t("categories.laureates")}
                </p>
                <p className="text-sm text-muted leading-relaxed mt-2">{t(`categories.desc.${c}` as never)}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-deep mt-4 group-hover:gap-2.5 transition-all">
                  {t("common.viewAll")}
                  <ArrowRightIcon className="w-4 h-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default function CategoryPage() {
  const { category: slug } = useParams<{ category: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { openLaureate } = useReader();
  const [q, setQ] = useState("");
  const [decade, setDecade] = useState<number | null>(null);

  const category: NobelCategory | null = slug && SLUG_CATEGORY[slug] ? SLUG_CATEGORY[slug] : null;

  const list = useMemo(() => (category ? laureatesByCategory(category) : []), [category]);
  const range = useMemo(() => (category ? categoryRange(category) : null), [category]);

  const filtered = useMemo(() => {
    const nq = q.trim().toLowerCase();
    return list.filter((l) => {
      if (decade != null && !l.awards.some((a) => a.year >= decade && a.year < decade + 10)) return false;
      if (nq && !l.name.toLowerCase().includes(nq)) return false;
      return true;
    });
  }, [list, q, decade]);

  if (!category || !range) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-semibold mb-4">{t("common.notFound")}</h1>
        <button onClick={() => navigate("/categories")} className="px-6 py-2.5 rounded-full bg-night text-white text-sm font-medium">
          {t("nav.categories")}
        </button>
      </div>
    );
  }

  const Icon = CATEGORY_ICONS[category];
  const latest = [...list]
    .sort((a, b) => Math.max(...b.awards.map((x) => x.year)) - Math.max(...a.awards.map((x) => x.year)))
    .slice(0, 3);

  const decades: number[] = [];
  for (let d = 1900; d <= 2020; d += 10) decades.push(d);

  return (
    <>
      <Seo
        title={`${t("categories.about")}: ${t(`categories.${category}` as never)}`}
        description={t(`categories.categoryAbout.${category}` as never) as string}
        path={`/category/${slug}`}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex items-start gap-5 mb-6">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-night text-gold shrink-0">
            <Icon className="w-8 h-8" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-deep">
              {t("categories.about")}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold mt-1">
              {t("categories.title", { category: t(`categories.${category}` as never) })}
            </h1>
            <p className="text-sm text-muted mt-2">
              {t("categories.firstAwarded")}: {range.first} · {countByCategory(category)} {t("categories.laureates")}
            </p>
          </div>
        </div>

        <p className="text-ink-soft leading-relaxed max-w-3xl mb-10">
          {t(`categories.categoryAbout.${category}` as never)}
        </p>

        <h2 className="font-serif text-2xl font-semibold mb-4">{t("categories.latestLaureates")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {latest.map((l) => (
            <LaureateCard key={l.slug} laureate={l} onOpen={openLaureate} />
          ))}
        </div>

        <h2 className="font-serif text-2xl font-semibold mb-4">{t("categories.fullList")}</h2>
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative grow max-w-md">
            <SearchIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("categories.searchInCategory", { category: t(`categories.${category}` as never) })}
              aria-label={t("common.search")}
              className="w-full text-sm bg-white border border-line rounded-full pl-10 pr-4 py-2.5 placeholder:text-muted/70 focus:border-gold focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label={t("filters.decade")}>
            {decades.map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDecade(decade === d ? null : d);
                  trackEvent("year_selected", { decade: d });
                }}
                aria-pressed={decade === d}
                className={`text-xs px-2.5 py-1.5 rounded-full border transition-colors ${
                  decade === d ? "bg-night text-white border-night" : "bg-white text-ink-soft border-line hover:border-gold"
                }`}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((l) => (
            <LaureateCard key={l.slug} laureate={l} onOpen={openLaureate} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-muted text-center py-10">{t("explore.noResults")}</p>
        )}
      </div>
    </>
  );
}
