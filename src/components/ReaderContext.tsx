import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { NobelLaureate } from "../types/nobel";
import ReaderModal from "./WikiReader";
import { trackEvent } from "../lib/analytics";

const Ctx = createContext<{ openLaureate: (l: NobelLaureate) => void }>({ openLaureate: () => {} });

export const useReader = () => useContext(Ctx);

export function ReaderProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<NobelLaureate | null>(null);

  const openLaureate = useCallback((l: NobelLaureate) => {
    trackEvent("laureate_opened", { name: l.name, from: "reader_panel" });
    setCurrent(l);
  }, []);

  return (
    <Ctx.Provider value={{ openLaureate }}>
      {children}
      {current && <ReaderModal laureate={current} onClose={() => setCurrent(null)} />}
    </Ctx.Provider>
  );
}
