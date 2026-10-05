import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CATEGORIES, CATEGORY_SLUG, type ExploreFilters, type NobelCategory } from "../types/nobel";
import { allCountries, YEAR_MIN, YEAR_MAX } from "../lib/laureates";
import { FilterIcon, CloseIcon } from "./icons";

interface Props {
  filters: ExploreFilters;
  onChange: (f: ExploreFilters) => void;
  resultCount: number;
}

const DECADES: number[] = [];
for (let d = 1900; d <= 2020; d += 10) DECADES.push(d);

export default function FilterBar({ filters, onChange, resultCount }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const countries = allCountries();

  const set = (patch: Partial<ExploreFilters>) => onChange({ ...filters, ...patch });

  const activeCount =
    (filters.category !== "all" ? 1 : 0) +
    (filters.from != null || filters.to != null ? 1 : 0) +
    (filters.decade != null ? 1 : 0) +
    (filters.country ? 1 : 0) +
    (filters.kind !== "all" ? 1 : 0);

  const reset = () =>
    onChange({ q: filters.q, category: "all", from: null, to: null, decade: null, country: null, kind: "all" });

  const body = (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">{t("filters.category")}</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label={t("filters.category")}>
          <FilterPill active={filters.category === "all"} onClick={() => set({ category: "all" })}>
            {t("filters.all")}
          </FilterPill>
          {CATEGORIES.map((c: NobelCategory) => (
            <FilterPill key={c} active={filters.category === c} onClick={() => set({ category: c })}>
              {t(`categories.${c}` as never)}
            </FilterPill>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">{t("filters.year")}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-sm text-muted">
            {t("filters.from")}{" "}
            <input
              type="number"
              min={YEAR_MIN}
              max={YEAR_MAX}
              value={filters.from ?? ""}
              placeholder={String(YEAR_MIN)}
              onChange={(e) => set({ from: e.target.value ? Number(e.target.value) : null, decade: null })}
              className="w-24 text-sm bg-white border border-line rounded-lg px-2.5 py-1.5 text-ink focus:border-gold focus:outline-none"
            />
          </label>
          <label className="text-sm text-muted">
            {t("filters.to")}{" "}
            <input
              type="number"
              min={YEAR_MIN}
              max={YEAR_MAX}
              value={filters.to ?? ""}
              placeholder={String(YEAR_MAX)}
              onChange={(e) => set({ to: e.target.value ? Number(e.target.value) : null, decade: null })}
              className="w-24 text-sm bg-white border border-line rounded-lg px-2.5 py-1.5 text-ink focus:border-gold focus:outline-none"
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2.5" role="group" aria-label={t("filters.decade")}>
          {DECADES.map((d) => (
            <button
              key={d}
              onClick={() => set({ decade: filters.decade === d ? null : d, from: null, to: null })}
              aria-pressed={filters.decade === d}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                filters.decade === d
                  ? "bg-night text-white border-night"
                  : "bg-white text-ink-soft border-line hover:border-gold"
              }`}
            >
              {d}s
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="f-country" className="text-xs font-semibold uppercase tracking-widest text-muted mb-2 block">
            {t("filters.country")}
          </label>
          <select
            id="f-country"
            value={filters.country ?? ""}
            onChange={(e) => set({ country: e.target.value || null })}
            className="w-full text-sm bg-white border border-line rounded-lg px-2.5 py-2 text-ink focus:border-gold focus:outline-none"
          >
            <option value="">{t("filters.allCountries")}</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">{t("filters.kind")}</p>
          <div className="flex gap-2" role="group" aria-label={t("filters.kind")}>
            {(
              [
                ["all", t("filters.all")],
                ["person", t("filters.person")],
                ["organization", t("filters.organization")],
              ] as const
            ).map(([v, label]) => (
              <FilterPill key={v} active={filters.kind === v} onClick={() => set({ kind: v })}>
                {label}
              </FilterPill>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-sm text-muted" aria-live="polite">
          {t("explore.subtitle", { count: resultCount.toLocaleString() })}
        </span>
        {activeCount > 0 && (
          <button onClick={reset} className="text-sm font-medium text-gold-deep hover:underline">
            {t("filters.reset")}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="mb-6">
      {/* Desktop: inline collapsible panel */}
      <div className="hidden md:block bg-white border border-line rounded-xl p-5">{body}</div>
      {/* Mobile: bottom sheet */}
      <div className="md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-line rounded-full text-sm font-medium shadow-sm"
          aria-haspopup="dialog"
        >
          <FilterIcon className="w-4 h-4" />
          {t("filters.filters")}
          {activeCount > 0 && (
            <span className="bg-gold text-white text-xs font-bold rounded-full w-5 h-5 inline-flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
        {open && (
          <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t("filters.filters")}>
            <div className="absolute inset-0 bg-night/50" onClick={() => setOpen(false)} aria-hidden />
            <div className="absolute bottom-0 left-0 right-0 bg-parchment rounded-t-2xl max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-line">
                <span className="font-serif font-semibold text-lg">{t("filters.filters")}</span>
                <button onClick={() => setOpen(false)} aria-label={t("common.close")} className="p-2">
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto px-5 py-5 grow">{body}</div>
              <div className="px-5 py-4 border-t border-line">
                <button
                  onClick={() => setOpen(false)}
                  className="w-full py-3 rounded-full bg-night text-white font-medium"
                >
                  {t("filters.applyFilters")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
        active
          ? "bg-night text-white border-night"
          : "bg-white text-ink-soft border-line hover:border-gold hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export { CATEGORY_SLUG };
