import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { NobelLaureate } from "../types/nobel";
import { ArrowRightIcon } from "./icons";

export function LaureateAvatar({ laureate, size = "md" }: { laureate: NobelLaureate; size?: "sm" | "md" | "lg" }) {
  const cls = size === "lg" ? "w-28 h-28 text-4xl" : size === "sm" ? "w-10 h-10 text-base" : "w-16 h-16 text-2xl";
  if (laureate.image) {
    return (
      <img
        src={laureate.image}
        alt={laureate.name}
        loading="lazy"
        className={`${cls} rounded-full object-cover border border-line bg-white shrink-0`}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={`${cls} rounded-full bg-gold-soft text-gold-deep font-serif font-semibold flex items-center justify-center shrink-0 border border-line`}
    >
      {laureate.name.charAt(0)}
    </span>
  );
}

export function awardLabel(l: NobelLaureate, t: (k: string) => string): string {
  const cats = [...new Set(l.awards.map((a) => t(`categories.${a.category}` as never)))];
  const years = l.awards.map((a) => a.year).sort((a, b) => a - b);
  return `${cats.join(" · ")} · ${years.join(", ")}`;
}

export default function LaureateCard({
  laureate,
  onOpen,
}: {
  laureate: NobelLaureate;
  onOpen?: (l: NobelLaureate) => void;
}) {
  const { t } = useTranslation();
  const first = laureate.awards[0];
  const motivation = first.motivation
    ? first.motivation.length > 140
      ? first.motivation.slice(0, 140).trimEnd() + "…"
      : first.motivation
    : "";

  const inner = (
    <>
      <div className="flex items-start gap-4">
        <LaureateAvatar laureate={laureate} />
        <div className="min-w-0">
          <h3 className="font-serif text-lg font-semibold leading-snug text-ink group-hover:text-gold-deep transition-colors">
            {laureate.name}
          </h3>
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-deep mt-1">
            {t(`categories.${first.category}` as never)} · {first.year}
            {laureate.awards.length > 1 &&
              ` · +${laureate.awards.length - 1} ${t("laureate.award").toLowerCase()}${laureate.awards.length > 2 ? "s" : ""}`}
          </p>
          {laureate.country && <p className="text-xs text-muted mt-0.5">{laureate.country}</p>}
        </div>
      </div>
      {motivation && (
        <p className="text-sm text-ink-soft leading-relaxed mt-3 line-clamp-3 first-letter:uppercase">{motivation}</p>
      )}
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-deep mt-4 group-hover:gap-2.5 transition-all">
        {t("card.readBiography")}
        <ArrowRightIcon className="w-4 h-4" />
      </span>
    </>
  );

  const cls =
    "group block bg-white border border-line rounded-xl p-5 hover:shadow-lg hover:border-gold/50 hover:-translate-y-0.5 transition-all text-left w-full";

  if (onOpen) {
    return (
      <button onClick={() => onOpen(laureate)} className={cls} aria-label={`${t("card.readBiography")}: ${laureate.name}`}>
        {inner}
      </button>
    );
  }
  return (
    <Link to={`/laureate/${laureate.slug}`} className={cls}>
      {inner}
    </Link>
  );
}
