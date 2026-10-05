import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import Seo from "../components/Seo";
import { CATEGORIES } from "../types/nobel";
import { laureates, allAwards, topCountries, womenLaureates, multiAwardLaureates } from "../lib/laureates";

const GOLD = "#B8943E";
const GOLD_DEEP = "#96742A";
const INK = "#1F2933";
const NIGHT = "#15171A";

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-line rounded-xl p-6">
      <h2 className="font-serif text-xl font-semibold mb-5">{title}</h2>
      {children}
    </section>
  );
}

export default function Statistics() {
  const { t, i18n } = useTranslation();
  const catName = (c: string) => t(`categories.${c}` as never) as string;

  const byCategory = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        name: catName(c),
        value: laureates.filter((l) => l.awards.some((a) => a.category === c)).length,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n.language],
  );

  const byDecade = useMemo(() => {
    const m = new Map<number, number>();
    for (const a of allAwards) {
      const d = Math.floor(a.year / 10) * 10;
      m.set(d, (m.get(d) ?? 0) + 1);
    }
    return [...m.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([d, value]) => ({ name: `${d}s`, value }));
  }, []);

  const perYear = useMemo(() => {
    const m = new Map<number, Set<string>>();
    for (const a of allAwards) {
      if (!m.has(a.year)) m.set(a.year, new Set());
      m.get(a.year)!.add(a.laureate.id);
    }
    return [...m.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([year, set]) => ({ year, value: set.size }));
  }, []);

  const peopleVsOrgs = useMemo(() => {
    const orgs = laureates.filter((l) => l.type === "organization").length;
    return [
      { name: t("statistics.people"), value: laureates.length - orgs },
      { name: t("statistics.organizations"), value: orgs },
    ];
  }, [t]);

  const countries = useMemo(() => topCountries(10), []);
  const women = useMemo(() => womenLaureates().length, []);
  const multi = useMemo(() => multiAwardLaureates(), []);

  const tipStyle = {
    background: "#fff",
    border: "1px solid #e5e1d5",
    borderRadius: 8,
    fontSize: 13,
  } as const;

  return (
    <>
      <Seo title={t("statistics.title")} path="/statistics" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-2">{t("statistics.title")}</h1>
        <p className="text-muted mb-8">{t("statistics.subtitle")}</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            [t("statistics.totalLaureates"), laureates.length],
            [t("statistics.totalPrizes"), allAwards.length],
            [t("statistics.women"), women],
            [t("statistics.multi"), multi.length],
          ].map(([label, value]) => (
            <div key={label as string} className="bg-night text-white rounded-xl p-5">
              <p className="font-serif text-3xl font-semibold text-gold">{(value as number).toLocaleString()}</p>
              <p className="text-sm text-white/60 mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <Panel title={t("statistics.byCategory")}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={byCategory} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e1d5" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: INK }} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12, fill: INK }} />
                <Tooltip contentStyle={tipStyle} />
                <Bar dataKey="value" fill={GOLD} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title={t("statistics.byDecade")}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={byDecade} margin={{ bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e1d5" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: INK }} interval={1} angle={-30} dy={8} height={50} />
                <YAxis tick={{ fontSize: 12, fill: INK }} />
                <Tooltip contentStyle={tipStyle} />
                <Bar dataKey="value" fill={NIGHT} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title={t("statistics.perYear")}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={perYear} margin={{ bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e1d5" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: INK }} minTickGap={40} />
                <YAxis tick={{ fontSize: 12, fill: INK }} />
                <Tooltip contentStyle={tipStyle} />
                <Area type="monotone" dataKey="value" stroke={GOLD_DEEP} fill={GOLD} fillOpacity={0.25} />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title={t("statistics.peopleVsOrgs")}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={peopleVsOrgs} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={3} label>
                  <Cell fill={GOLD} />
                  <Cell fill={NIGHT} />
                </Pie>
                <Tooltip contentStyle={tipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </Panel>
        </div>

        <Panel title={t("statistics.topCountries")}>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={countries} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e1d5" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: INK }} />
              <YAxis type="category" dataKey="country" width={140} tick={{ fontSize: 12, fill: INK }} />
              <Tooltip contentStyle={tipStyle} />
              <Bar dataKey="count" fill={GOLD_DEEP} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted mt-4">{t("statistics.note")}</p>
        </Panel>
      </div>
    </>
  );
}
