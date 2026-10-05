import type { SVGProps, ReactElement } from "react";
import type { NobelCategory } from "../types/nobel";

type P = SVGProps<SVGSVGElement>;

/** Elegant thin-stroke icons for the six Nobel categories. */
export function PhysicsIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </svg>
  );
}

export function ChemistryIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path d="M9 3h6M10 3v5.5L4.8 17a2.4 2.4 0 0 0 2.1 3.6h10.2a2.4 2.4 0 0 0 2.1-3.6L14 8.5V3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 14h9" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MedicineIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path d="M12 21c-5 0-8-3.5-8-8 0-5 4-6 5.5-9.5C10.5 1.5 12 1 12 1s1.5.5 2.5 2.5C16 7 20 8 20 13c0 4.5-3 8-8 8Z" strokeLinejoin="round" />
      <path d="M12 6v13M8.5 9.5h7M9 13h6" strokeLinecap="round" />
    </svg>
  );
}

export function LiteratureIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z" strokeLinejoin="round" />
      <path d="M4 20.5V5.5M20 18v3H6.5" strokeLinecap="round" />
      <path d="M9 8h7M9 11.5h5" strokeLinecap="round" />
    </svg>
  );
}

export function PeaceIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M5 7.5c4 2.5 10 2.5 14 0M5 16.5c4-2.5 10-2.5 14 0" strokeLinecap="round" />
    </svg>
  );
}

export function EconomicsIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path d="M3 20h18" strokeLinecap="round" />
      <path d="M5 20v-6M10 20V8M15 20v-9M20 20V5" strokeLinecap="round" />
      <path d="M4 7l5-3 4 2 4-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MedalIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <circle cx="12" cy="14" r="6" />
      <circle cx="12" cy="14" r="4.2" />
      <path d="M8.5 9.5 6 3h4l2 4 2-4h4l-2.5 6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

export function DiceIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="8.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="15.5" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ArrowRightIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M4 12h15m-6-7 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ExternalIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M14 4h6v6M20 4 11 13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6" strokeLinecap="round" />
    </svg>
  );
}

export function MenuIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

export function FilterIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M4 5h16l-6 8v5l-4 2v-7L4 5Z" strokeLinejoin="round" />
    </svg>
  );
}

export const CATEGORY_ICONS: Record<NobelCategory, (p: P) => ReactElement> = {
  Physics: PhysicsIcon,
  Chemistry: ChemistryIcon,
  "Physiology or Medicine": MedicineIcon,
  Literature: LiteratureIcon,
  Peace: PeaceIcon,
  "Economic Sciences": EconomicsIcon,
};
