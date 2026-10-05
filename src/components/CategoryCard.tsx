import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { NobelCategory } from "../types/nobel";
import { CATEGORY_SLUG } from "../types/nobel";
import { countByCategory } from "../lib/laureates";
import { CATEGORY_ICONS, ArrowRightIcon } from "./icons";

export default function CategoryCard({ category }: { category: NobelCategory }) {
  const { t } = useTranslation();
  const Icon = CATEGORY_ICONS[category];
  const count = countByCategory(category);
  return (
    <Link
      to={`/category/${CATEGORY_SLUG[category]}`}
      className="group bg-white border border-line rounded-xl p-6 hover:shadow-lg hover:border-gold/50 hover:-translate-y-0.5 transition-all block"
    >
      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-soft text-gold-deep mb-4 group-hover:bg-gold group-hover:text-white transition-colors">
        <Icon className="w-6 h-6" />
      </span>
      <h3 className="font-serif text-xl font-semibold text-ink">{t(`categories.${category}` as never)}</h3>
      <p className="text-sm text-gold-deep font-semibold mt-1">
        {count} {t("categories.laureates")}
      </p>
      <p className="text-sm text-muted leading-relaxed mt-2 line-clamp-2">{t(`categories.desc.${category}` as never)}</p>
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-deep mt-4 group-hover:gap-2.5 transition-all">
        {t("common.viewAll")}
        <ArrowRightIcon className="w-4 h-4" />
      </span>
    </Link>
  );
}
