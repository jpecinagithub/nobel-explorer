import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../components/Seo";
import { ExternalIcon, ArrowRightIcon } from "../components/icons";

export default function AlfredNobel() {
  const { t } = useTranslation();
  const sections = t("alfred.sections", { returnObjects: true }) as Record<string, { title: string; text: string }>;
  const order = ["early", "inventor", "business", "personal", "will", "legacy"];

  return (
    <>
      <Seo title={t("alfred.title")} path="/alfred-nobel" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <Link to="/history" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-gold-deep mb-6">
          <ArrowRightIcon className="w-4 h-4 rotate-180" />
          {t("alfred.historyLink")}
        </Link>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-deep mb-3">1833 – 1896</p>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold mb-4">{t("alfred.title")}</h1>
        <p className="text-lg text-ink-soft leading-relaxed mb-12 max-w-3xl">{t("alfred.intro")}</p>

        <div className="grid gap-8 sm:grid-cols-2 mb-12">
          {order.map((key) => (
            <section key={key} className="bg-white border border-line rounded-xl p-6">
              <h2 className="font-serif text-xl font-semibold mb-3">{sections[key].title}</h2>
              <p className="text-ink-soft text-[15px] leading-relaxed">{sections[key].text}</p>
            </section>
          ))}
        </div>

        <a
          href="https://en.wikipedia.org/wiki/Alfred_Nobel"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-line bg-white text-sm font-medium hover:border-gold transition-colors"
        >
          {t("alfred.wikiLink")}
          <ExternalIcon className="w-4 h-4" />
        </a>
      </div>
    </>
  );
}
