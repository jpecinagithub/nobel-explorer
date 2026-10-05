import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../components/Seo";
import SearchBar from "../components/SearchBar";
import CategoryCard from "../components/CategoryCard";
import LaureateCard from "../components/LaureateCard";
import { useReader } from "../components/ReaderContext";
import { DiceIcon, ArrowRightIcon } from "../components/icons";
import { CATEGORIES, type NobelCategory } from "../types/nobel";
import {
  laureates,
  famousLaureates,
  randomLaureate,
  getLaureateBySlug,
  YEAR_MIN,
  YEAR_MAX,
} from "../lib/laureates";
import { getRecent } from "../lib/recent";
import { trackEvent } from "../lib/analytics";

const TIMELINE_PREVIEW = ["1833", "1867", "1895", "1901", "1968"];

export default function Home() {
  const { t, i18n } = useTranslation();
  const { openLaureate } = useReader();
  const navigate = useNavigate();
  const [dice, setDice] = useState(0);

  const featured = useMemo(() => {
    const pool = famousLaureates();
    const picks: typeof pool = [];
    const used = new Set<number>();
    let seed = dice * 7919 + 13;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    while (picks.length < 3 && used.size < pool.length) {
      const i = Math.floor(rand() * pool.length);
      if (!used.has(i)) {
        used.add(i);
        picks.push(pool[i]);
      }
    }
    return picks;
  }, [dice]);

  const recent = useMemo(() => getRecent().map(getLaureateBySlug).filter(Boolean), []);
  const events: { year: string; text: string }[] = t("history.events", { returnObjects: true }) as never;

  const orgCount = laureates.filter((l) => l.type === "organization").length;

  const surprise = () => {
    trackEvent("random_laureate_clicked", { from: "home" });
    const l = randomLaureate();
    navigate(`/laureate/${l.slug}`);
  };

  return (
    <>
      <Seo />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-night" aria-hidden />
        <div
          className="absolute inset-0 opacity-[0.07]"
          aria-hidden
          style={{
            backgroundImage: "radial-gradient(circle at 30% 20%, #b8943e 0, transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 text-center">
          <p className="text-gold text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] mb-5">
            1901 — {YEAR_MAX}
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl font-semibold text-white leading-tight max-w-3xl mx-auto">
            {t("hero.title")}
          </h1>
          <p className="text-white/70 text-lg mt-5 max-w-2xl mx-auto">{t("hero.subtitle")}</p>
          <div className="mt-8">
            <SearchBar size="hero" onSelectLaureate={openLaureate} />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-white/50">{t("hero.examples")}</span>
            {(t("hero.exampleQueries", { returnObjects: true }) as string[]).map((q) => (
              <button
                key={q}
                onClick={() => navigate(`/explore?q=${encodeURIComponent(q)}`)}
                className="px-3 py-1 rounded-full border border-white/20 text-white/80 hover:border-gold hover:text-gold transition-colors text-[13px]"
              >
                {q}
              </button>
            ))}
          </div>
          <p className="text-white/40 text-xs mt-8">
            {t("hero.statsLine", {
              count: laureates.length.toLocaleString(i18n.language),
              orgs: orgCount,
              years: YEAR_MAX - YEAR_MIN + 1,
            })}
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-14">
        <h2 className="font-serif text-3xl font-semibold mb-1">{t("home.categoriesTitle")}</h2>
        <p className="text-muted mb-6">{t("home.categoriesSubtitle")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((c: NobelCategory) => (
            <CategoryCard key={c} category={c} />
          ))}
        </div>
      </section>

      {/* Discover */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-serif text-3xl font-semibold mb-1">{t("home.discoverTitle")}</h2>
            <p className="text-muted">{t("home.discoverSubtitle")}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setDice((d) => d + 1)}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-line bg-white text-sm font-medium hover:border-gold transition-colors"
            >
              {t("home.shuffle")}
            </button>
            <button
              onClick={surprise}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-night text-white text-sm font-medium hover:bg-ink-soft transition-colors"
            >
              <DiceIcon className="w-4 h-4" />
              {t("random.button")}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((l) => (
            <LaureateCard key={l!.slug} laureate={l!} onOpen={openLaureate} />
          ))}
        </div>
      </section>

      {/* History teaser */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
        <div className="bg-night rounded-2xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            aria-hidden
            style={{ backgroundImage: "radial-gradient(circle at 80% 10%, #b8943e 0, transparent 45%)" }}
          />
          <div className="relative">
            <h2 className="font-serif text-3xl font-semibold mb-3">{t("home.historyTitle")}</h2>
            <p className="text-white/70 max-w-2xl leading-relaxed">{t("home.historyText")}</p>
            <div className="flex flex-wrap gap-x-8 gap-y-2 mt-6 mb-8">
              {TIMELINE_PREVIEW.map((y) => {
                const ev = events.find((e) => e.year === y);
                return (
                  <div key={y} className="flex items-center gap-2.5">
                    <span className="font-serif text-gold text-lg font-semibold">{y}</span>
                    <span className="text-white/60 text-sm max-w-[220px] leading-snug">{ev?.text}</span>
                  </div>
                );
              })}
            </div>
            <Link
              to="/history"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-night font-semibold text-sm hover:bg-white transition-colors"
              onClick={() => trackEvent("history_opened", { from: "home" })}
            >
              {t("home.historyCta")}
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recently viewed */}
      {recent.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
          <h2 className="font-serif text-2xl font-semibold mb-5">{t("home.recentTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.slice(0, 3).map((l) => (
              <LaureateCard key={l!.slug} laureate={l!} onOpen={openLaureate} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
