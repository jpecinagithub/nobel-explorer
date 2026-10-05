import { useTranslation } from "react-i18next";
import Seo from "../components/Seo";
import { MedalIcon } from "../components/icons";

export function Sources() {
  const { t } = useTranslation();
  const points = t("sources.points", { returnObjects: true }) as { title: string; text: string }[];
  return (
    <>
      <Seo title={t("sources.title")} path="/sources" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-2">{t("sources.title")}</h1>
        <p className="text-muted mb-10">{t("sources.subtitle")}</p>
        <p className="text-lg text-ink-soft leading-relaxed mb-10">{t("sources.intro")}</p>
        <div className="grid gap-5 sm:grid-cols-2 mb-10">
          {points.map((p) => (
            <div key={p.title} className="bg-white border border-line rounded-xl p-6">
              <h2 className="font-serif text-xl font-semibold mb-3">{p.title}</h2>
              <p className="text-ink-soft text-[15px] leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted leading-relaxed border-t border-line pt-6">{t("sources.independence")}</p>
      </div>
    </>
  );
}

export function Privacy() {
  const { t, i18n } = useTranslation();
  const es = i18n.language === "es";
  return (
    <>
      <Seo title={t("footer.privacy")} path="/privacy" />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-soft text-gold-deep mb-5">
          <MedalIcon className="w-6 h-6" />
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-6">{t("footer.privacy")}</h1>
        <div className="space-y-5 text-ink-soft leading-relaxed">
          {es ? (
            <>
              <p>Nobel Explorer no requiere registro ni cuentas. No recopilamos datos personales.</p>
              <p>Tu preferencia de idioma, los laureados vistos recientemente y una caché de 24 horas de los artículos de Wikipedia se guardan únicamente en tu navegador (localStorage). Nada se envía a nuestros servidores.</p>
              <p>Al leer una biografía, tu navegador contacta directamente con Wikipedia/Wikimedia para obtener el contenido del artículo, según sus propias políticas de privacidad.</p>
              <p>Las estadísticas de uso anónimas se recopilan mediante Vercel Analytics sin identificarte personalmente.</p>
            </>
          ) : (
            <>
              <p>Nobel Explorer requires no registration or accounts. We collect no personal data.</p>
              <p>Your language preference, recently viewed laureates and a 24-hour cache of Wikipedia articles are stored only in your browser (localStorage). Nothing is sent to our servers.</p>
              <p>When reading a biography, your browser contacts Wikipedia/Wikimedia directly to fetch article content, subject to their own privacy policies.</p>
              <p>Anonymous usage statistics are collected via Vercel Analytics without personally identifying you.</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
