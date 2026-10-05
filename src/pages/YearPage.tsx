import { Link, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../components/Seo";
import LaureateCard from "../components/LaureateCard";
import { useReader } from "../components/ReaderContext";
import { CATEGORY_ICONS, ArrowRightIcon } from "../components/icons";
import { CATEGORIES, type NobelCategory } from "../types/nobel";
import { awardsByYear, YEAR_MIN, YEAR_MAX } from "../lib/laureates";
import { trackEvent } from "../lib/analytics";

export function YearsPage() {
  const { t } = useTranslation();
  const years: number[] = [];
  for (let y = YEAR_MAX; y >= YEAR_MIN; y--) years.push(y);

  // Group by decade for a compact timeline.
  const decades = new Map<number, number[]>();
  for (const y of years) {
    const d = Math.floor(y / 10) * 10;
    if (!decades.has(d)) decades.set(d, []);
    decades.get(d)!.push(y);
  }

  return (
    <>
      <Seo title={t("nav.years")} path="/years" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-2">{t("year.exploreTitle")}</h1>
        <p className="text-muted mb-8">{t("year.exploreSubtitle")}</p>
        {[...decades.entries()].map(([d, ys]) => (
          <div key={d} className="mb-8">
            <h2 className="font-serif text-xl font-semibold text-gold-deep mb-3">{d}s</h2>
            <div className="flex flex-wrap gap-2">
              {ys.map((y) => (
                <Link
                  key={y}
                  to={`/year/${y}`}
                  onClick={() => trackEvent("year_selected", { year: y })}
                  className="w-16 py-2.5 text-center text-sm font-medium bg-white border border-line rounded-lg hover:border-gold hover:text-gold-deep transition-colors"
                >
                  {y}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function YearPage() {
  const { year: yearParam } = useParams<{ year: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { openLaureate } = useReader();
  const year = yearParam && /^\d{4}$/.test(yearParam) ? Number(yearParam) : NaN;

  if (!Number.isInteger(year) || year < YEAR_MIN || year > YEAR_MAX) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-semibold mb-4">{t("common.notFound")}</h1>
        <button onClick={() => navigate("/years")} className="px-6 py-2.5 rounded-full bg-night text-white text-sm font-medium">
          {t("year.allYears")}
        </button>
      </div>
    );
  }

  const awards = awardsByYear(year);
  const byCategory = CATEGORIES.map((c: NobelCategory) => ({
    category: c,
    entries: awards.filter((a) => a.category === c),
  })).filter((g) => g.entries.length > 0);
  const missing = CATEGORIES.filter((c) => !awards.some((a) => a.category === c));

  return (
    <>
      <Seo
        title={t("year.title", { year })}
        description={t("year.title", { year }) as string}
        path={`/year/${year}`}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/years" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-gold-deep">
            <ArrowRightIcon className="w-4 h-4 rotate-180" />
            {t("year.allYears")}
          </Link>
          <div className="flex gap-2">
            {year > YEAR_MIN && (
              <Link to={`/year/${year - 1}`} className="px-3 py-1.5 text-sm border border-line rounded-full bg-white hover:border-gold">
                ← {year - 1}
              </Link>
            )}
            {year < YEAR_MAX && (
              <Link to={`/year/${year + 1}`} className="px-3 py-1.5 text-sm border border-line rounded-full bg-white hover:border-gold">
                {year + 1} →
              </Link>
            )}
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-semibold mb-2">{t("year.title", { year })}</h1>
        <p className="text-muted mb-10">
          {t("year.prizesCount", { n: awards.length })} ·{" "}
          {t("year.laureatesCount", { n: new Set(awards.map((a) => a.laureate.id)).size })}
        </p>

        {byCategory.map(({ category, entries }) => {
          const Icon = CATEGORY_ICONS[category];
          return (
            <section key={category} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gold-soft text-gold-deep">
                  <Icon className="w-5 h-5" />
                </span>
                <h2 className="font-serif text-2xl font-semibold">{t(`categories.${category}` as never)}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {entries.map((a) => (
                  <LaureateCard key={a.laureate.slug} laureate={a.laureate} onOpen={openLaureate} />
                ))}
              </div>
            </section>
          );
        })}

        {missing.length > 0 && (
          <p className="text-sm text-muted mt-6">
            {missing.map((c) => t(`categories.${c}` as never)).join(", ")}: {t("year.notAwarded")}
          </p>
        )}
      </div>
    </>
  );
}
