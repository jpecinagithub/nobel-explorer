import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../components/Seo";
import { ArrowRightIcon } from "../components/icons";

export default function History() {
  const { t } = useTranslation();
  const events = t("history.events", { returnObjects: true }) as { year: string; text: string }[];
  const sections = t("history.sections", { returnObjects: true }) as Record<string, { title: string; text: string }>;
  const order = ["nobel", "will", "first", "economics", "ceremonies", "medal"];

  return (
    <>
      <Seo title={t("history.title")} path="/history" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-deep mb-3">
          {t("nav.history")}
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold mb-4">{t("history.title")}</h1>
        <p className="text-lg text-ink-soft leading-relaxed mb-12 max-w-3xl">{t("history.intro")}</p>

        <div className="space-y-10 mb-16">
          {order.map((key) => (
            <section key={key}>
              <h2 className="font-serif text-2xl font-semibold mb-3">{sections[key].title}</h2>
              <p className="text-ink-soft leading-relaxed">{sections[key].text}</p>
            </section>
          ))}
        </div>

        <h2 className="font-serif text-2xl font-semibold mb-8">{t("history.timelineTitle")}</h2>
        <ol className="relative border-l-2 border-gold/40 ml-2 space-y-8 mb-16">
          {events.map((e) => (
            <li key={e.year} className="ml-8 relative">
              <span
                className="absolute -left-[43px] top-1 w-4 h-4 rounded-full bg-gold border-2 border-parchment"
                aria-hidden
              />
              <p className="font-serif text-xl font-semibold text-gold-deep">{e.year}</p>
              <p className="text-ink-soft mt-1 leading-relaxed">{e.text}</p>
            </li>
          ))}
        </ol>

        <div className="bg-night rounded-2xl p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h2 className="font-serif text-2xl font-semibold mb-2">Alfred Nobel</h2>
            <p className="text-white/70">{t("history.alfredText")}</p>
          </div>
          <Link
            to="/alfred-nobel"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-night font-semibold text-sm hover:bg-white transition-colors shrink-0"
          >
            {t("history.alfredCta")}
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
