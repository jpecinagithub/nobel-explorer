import { useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../components/Seo";
import { LaureateHeader, WikiReaderBody } from "../components/WikiReader";
import LaureateCard from "../components/LaureateCard";
import { useReader } from "../components/ReaderContext";
import { getLaureateBySlug, laureates } from "../lib/laureates";
import { pushRecent } from "../lib/recent";
import { trackEvent } from "../lib/analytics";
import { ArrowRightIcon } from "../components/icons";

export default function LaureatePage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { openLaureate } = useReader();
  const laureate = slug ? getLaureateBySlug(slug) : undefined;

  useEffect(() => {
    if (laureate) {
      pushRecent(laureate.slug);
      trackEvent("laureate_opened", { name: laureate.name, from: "page" });
    }
  }, [laureate]);

  const related = useMemo(() => {
    if (!laureate) return [];
    const cats = new Set(laureate.awards.map((a) => a.category));
    return laureates
      .filter((l) => l.slug !== laureate.slug && l.awards.some((a) => cats.has(a.category)))
      .slice(0, 3);
  }, [laureate]);

  if (!laureate) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-semibold mb-4">{t("common.laureateNotFound")}</h1>
        <button
          onClick={() => navigate("/explore")}
          className="px-6 py-2.5 rounded-full bg-night text-white text-sm font-medium"
        >
          {t("nav.explore")}
        </button>
      </div>
    );
  }

  const first = laureate.awards[0];
  return (
    <>
      <Seo
        title={laureate.name}
        description={`${laureate.name} — ${t(`categories.${first.category}` as never)} ${first.year}. ${first.motivation}`.slice(0, 160)}
        path={`/laureate/${laureate.slug}`}
        image={laureate.image}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-gold-deep mb-6">
          <ArrowRightIcon className="w-4 h-4 rotate-180" />
          {t("nav.explore")}
        </Link>

        <LaureateHeader laureate={laureate} />

        <div className="mt-10">
          <h2 className="font-serif text-2xl font-semibold mb-5 pb-3 border-b border-line">
            {t("laureate.biography")}
          </h2>
          <WikiReaderBody laureate={laureate} />
        </div>

        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="font-serif text-2xl font-semibold mb-5">
              {t(`categories.${first.category}` as never)}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((l) => (
                <LaureateCard key={l.slug} laureate={l} onOpen={openLaureate} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
