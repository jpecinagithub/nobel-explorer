import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { suggest, type Suggestion } from "../lib/search";
import type { NobelLaureate } from "../types/nobel";
import { SearchIcon, MedalIcon } from "./icons";
import { trackEvent } from "../lib/analytics";

interface Props {
  size?: "hero" | "compact";
  initialValue?: string;
  onSelectLaureate?: (l: NobelLaureate) => void;
  autoFocus?: boolean;
}

export default function SearchBar({ size = "compact", initialValue = "", onSelectLaureate, autoFocus }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [debounced, setDebounced] = useState(initialValue);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), 120);
    return () => clearTimeout(id);
  }, [value]);

  const suggestions: Suggestion[] = useMemo(() => suggest(debounced), [debounced]);

  useEffect(() => setActive(0), [suggestions.length]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const go = (s: Suggestion) => {
    setOpen(false);
    if (s.kind === "laureate" && s.laureate) {
      trackEvent("laureate_opened", { name: s.laureate.name, from: "autocomplete" });
      if (onSelectLaureate) onSelectLaureate(s.laureate);
      else navigate(`/laureate/${s.laureate.slug}`);
    } else if (s.query) {
      trackEvent("search_performed", { query: s.query.slice(0, 60) });
      navigate(`/explore?q=${encodeURIComponent(s.query)}`);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (open && suggestions[active]) {
      go(suggestions[active]);
      return;
    }
    if (!value.trim()) return;
    setOpen(false);
    trackEvent("search_performed", { query: value.trim().slice(0, 60) });
    navigate(`/explore?q=${encodeURIComponent(value.trim())}`);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" && open) {
      e.preventDefault();
      setActive((a) => (a + 1) % suggestions.length);
    } else if (e.key === "ArrowUp" && open) {
      e.preventDefault();
      setActive((a) => (a - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const hero = size === "hero";

  return (
    <div ref={boxRef} className={`relative ${hero ? "w-full max-w-2xl mx-auto" : "w-full"}`}>
      <form onSubmit={submit} role="search">
        <div className="relative">
          <SearchIcon
            className={`absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none ${hero ? "w-5 h-5" : "w-4 h-4"}`}
          />
          <input
            ref={inputRef}
            value={value}
            autoFocus={autoFocus}
            onChange={(e) => {
              setValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKey}
            placeholder={hero ? t("hero.searchPlaceholder") : t("explore.searchPlaceholder")}
            aria-label={t("common.search")}
            aria-expanded={open && suggestions.length > 0}
            aria-controls="search-suggestions"
            role="combobox"
            aria-autocomplete="list"
            className={`w-full bg-white border border-line rounded-full shadow-sm pl-12 pr-5 placeholder:text-muted/70 focus:border-gold focus:ring-2 focus:ring-gold/25 focus:outline-none transition-shadow ${
              hero ? "py-4 text-lg" : "py-2.5 text-sm"
            }`}
          />
        </div>
      </form>

      {open && suggestions.length > 0 && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute z-50 mt-2 w-full bg-white border border-line rounded-xl shadow-xl overflow-hidden"
        >
          {suggestions.map((s, i) => (
            <button
              key={`${s.kind}-${s.label}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(s)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left ${
                i === active ? "bg-gold-soft" : "bg-white"
              }`}
            >
              {s.kind === "laureate" ? (
                <>
                  {s.laureate?.image ? (
                    <img
                      src={s.laureate.image}
                      alt=""
                      loading="lazy"
                      className="w-9 h-9 rounded-full object-cover border border-line shrink-0"
                    />
                  ) : (
                    <span className="w-9 h-9 rounded-full bg-gold-soft text-gold-deep flex items-center justify-center shrink-0 font-serif font-semibold">
                      {s.label.charAt(0)}
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block font-medium text-ink truncate">{s.label}</span>
                    <span className="block text-xs text-muted truncate">{s.sub}</span>
                  </span>
                </>
              ) : s.kind === "topic" ? (
                <>
                  <span className="text-gold-deep shrink-0">
                    <SearchIcon className="w-4 h-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm text-ink truncate">
                      {s.label} <span className="text-muted text-xs">— topic</span>
                    </span>
                  </span>
                </>
              ) : (
                <>
                  <span className="text-gold-deep shrink-0">
                    <MedalIcon className="w-4 h-4" />
                  </span>
                  <span className="text-sm font-medium text-ink">{s.label}</span>
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
