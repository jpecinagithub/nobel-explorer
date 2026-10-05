import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import "./i18n";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ReaderProvider } from "./components/ReaderContext";

const Home = lazy(() => import("./pages/Home"));
const Explore = lazy(() => import("./pages/Explore"));
const Discover = lazy(() => import("./pages/Discover"));
const LaureatePage = lazy(() => import("./pages/LaureatePage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const CategoriesPage = lazy(() => import("./pages/CategoryPage").then((m) => ({ default: m.CategoriesPage })));
const YearPage = lazy(() => import("./pages/YearPage"));
const YearsPage = lazy(() => import("./pages/YearPage").then((m) => ({ default: m.YearsPage })));
const History = lazy(() => import("./pages/History"));
const AlfredNobel = lazy(() => import("./pages/AlfredNobel"));
const Statistics = lazy(() => import("./pages/Statistics"));
const Sources = lazy(() => import("./pages/Info").then((m) => ({ default: m.Sources })));
const Privacy = lazy(() => import("./pages/Info").then((m) => ({ default: m.Privacy })));
const Author = lazy(() => import("./pages/Author"));

function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-serif text-4xl font-semibold mb-4">{t("common.notFound")}</h1>
      <p className="text-muted mb-8">{t("common.notFoundText")}</p>
      <Link to="/" className="px-6 py-2.5 rounded-full bg-night text-white text-sm font-medium">
        {t("common.goHome")}
      </Link>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ReaderProvider>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="grow">
              <Suspense
                fallback={
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-4" aria-hidden>
                    <div className="skeleton h-9 w-64" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-5/6" />
                    <div className="skeleton h-4 w-4/6" />
                  </div>
                }
              >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/laureate/:slug" element={<LaureatePage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/years" element={<YearsPage />} />
                <Route path="/year/:year" element={<YearPage />} />
                <Route path="/history" element={<History />} />
                <Route path="/alfred-nobel" element={<AlfredNobel />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/sources" element={<Sources />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/author" element={<Author />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </ReaderProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
