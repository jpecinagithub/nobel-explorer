import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { NobelLaureate } from "../types/nobel";
import { loadWikiArticle, type WikiContent } from "../lib/wiki";
import { trackEvent } from "../lib/analytics";
import { pushRecent } from "../lib/recent";
import { CloseIcon, ExternalIcon } from "./icons";
import { LaureateAvatar } from "./LaureateCard";

function Skeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="skeleton h-7 w-3/4" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-5/6" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-2/3" />
    </div>
  );
}

export function WikiReaderBody({ laureate }: { laureate: NobelLaureate }) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "es" ? "es" : "en") as "en" | "es";
  const [state, setState] = useState<{ status: "loading" } | { status: "ok"; data: WikiContent } | { status: "error" }>({
    status: "loading",
  });

  const load = () => {
    setState({ status: "loading" });
    loadWikiArticle(laureate.name, laureate.wiki, lang)
      .then((data) => setState({ status: "ok", data }))
      .catch(() => setState({ status: "error" }));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [laureate.slug, lang]);

  if (state.status === "loading") {
    return (
      <div role="status" aria-label={t("laureate.loading")}>
        <Skeleton />
      </div>
    );
  }

  if (state.status === "error") {
    const wikiUrl = laureate.wiki
      ? `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(laureate.wiki)}`
      : `https://${lang}.wikipedia.org/w/index.php?search=${encodeURIComponent(laureate.name)}`;
    return (
      <div className="text-center py-10">
        <p className="text-ink-soft mb-5">{t("laureate.unavailable")}</p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={load}
            className="px-5 py-2.5 rounded-full bg-night text-white text-sm font-medium hover:bg-ink-soft transition-colors"
          >
            {t("laureate.tryAgain")}
          </button>
          <a
            href={wikiUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("wikipedia_external_link_clicked", { name: laureate.name })}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-line text-sm font-medium text-ink hover:border-gold transition-colors"
          >
            {t("laureate.viewOriginal")}
            <ExternalIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  const { data } = state;
  return (
    <article>
      {data.fallbackFromEs && (
        <p className="text-sm bg-gold-soft border border-gold/40 text-gold-deep rounded-lg px-4 py-3 mb-6" role="note">
          {t("laureate.notAvailableEs")}
        </p>
      )}
      {data.description && (
        <p className="text-sm uppercase tracking-widest text-muted mb-2">{data.description}</p>
      )}
      {data.extract && !data.html && <p className="text-ink-soft leading-relaxed">{data.extract}</p>}
      {data.html ? (
        <div className="wiki-article" dangerouslySetInnerHTML={{ __html: data.html }} />
      ) : null}
      <div className="mt-8 pt-5 border-t border-line flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted">
          {t("laureate.source")} · Wikipedia ({data.lang.toUpperCase()}) · {t("laureate.license")}
        </p>
        <a
          href={data.pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("wikipedia_external_link_clicked", { name: laureate.name })}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-deep hover:underline"
        >
          {t("laureate.viewOriginal")}
          <ExternalIcon className="w-4 h-4" />
        </a>
      </div>
    </article>
  );
}

export function LaureateHeader({ laureate, compact }: { laureate: NobelLaureate; compact?: boolean }) {
  const { t } = useTranslation();
  const awards = [...laureate.awards].sort((a, b) => a.year - b.year);
  return (
    <div className={compact ? "" : "flex flex-col sm:flex-row gap-6 items-start"}>
      <LaureateAvatar laureate={laureate} size={compact ? "md" : "lg"} />
      <div className="min-w-0 flex-1">
        <h1 className={`font-serif font-semibold text-ink ${compact ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
          {laureate.name}
        </h1>
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-deep mt-2">
          {awards.map((a) => `${t(`categories.${a.category}` as never)} ${a.year}`).join(" · ")}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-sm text-muted">
          {laureate.type === "person" ? (
            <>
              {laureate.birthYear && (
                <span>
                  {t("laureate.born")}: {laureate.birthYear}
                  {laureate.deathYear ? ` – ${laureate.deathYear}` : ""}
                </span>
              )}
              {laureate.country && (
                <span>
                  {t("laureate.nationality")}: {laureate.country}
                </span>
              )}
            </>
          ) : (
            laureate.foundedYear && (
              <span>
                {t("laureate.founded")}: {laureate.foundedYear}
              </span>
            )
          )}
        </div>
        {!compact && awards[0]?.motivation && (
          <blockquote className="mt-4 pl-4 border-l-2 border-gold text-ink-soft italic leading-relaxed first-letter:uppercase">
            {awards[0].motivation}
            {awards.length > 1 && (
              <span className="block mt-2 not-italic text-xs text-muted">
                {t("laureate.alsoAwarded")}:{" "}
                {awards
                  .slice(1)
                  .map((a) => `${t(`categories.${a.category}` as never)} ${a.year}`)
                  .join(", ")}
              </span>
            )}
          </blockquote>
        )}
        {!compact && laureate.keywords.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2" aria-label={t("laureate.topics")}>
            {laureate.keywords.slice(0, 8).map((k) => (
              <Link
                key={k}
                to={`/explore?q=${encodeURIComponent(k)}`}
                className="text-xs px-3 py-1 rounded-full bg-gold-soft text-gold-deep font-medium hover:bg-gold hover:text-white transition-colors"
              >
                {k}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Slide-over reader panel (desktop) / full-screen (mobile). */
export default function ReaderModal({
  laureate,
  onClose,
}: {
  laureate: NobelLaureate;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    pushRecent(laureate.slug);
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [laureate.slug, onClose]);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={laureate.name}>
      <div className="absolute inset-0 bg-night/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <aside className="absolute right-0 top-0 h-full w-full sm:w-[min(720px,92vw)] bg-parchment shadow-2xl flex flex-col animate-[slideIn_0.25s_ease-out]">
        <div className="flex items-center justify-between gap-3 px-5 sm:px-8 py-4 border-b border-line shrink-0">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted">
            Nobel Explorer · {t("laureate.biography")}
          </span>
          <div className="flex items-center gap-2">
            <Link
              to={`/laureate/${laureate.slug}`}
              className="text-xs font-medium text-gold-deep hover:underline px-2 py-1"
            >
              {t("laureate.openFullPage")}
            </Link>
            <button
              onClick={onClose}
              aria-label={t("common.close")}
              className="p-2 rounded-full hover:bg-black/5 text-ink-soft"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="reader-scroll overflow-y-auto px-5 sm:px-8 py-6 grow">
          <LaureateHeader laureate={laureate} compact />
          <div className="mt-6">
            <WikiReaderBody laureate={laureate} />
          </div>
        </div>
      </aside>
      <style>{`@keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: none; opacity: 1; } }`}</style>
    </div>
  );
}
