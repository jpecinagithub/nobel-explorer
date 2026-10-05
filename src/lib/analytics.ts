import { track as vercelTrack } from "@vercel/analytics";

export type AnalyticsEvent =
  | "search_performed"
  | "laureate_opened"
  | "category_selected"
  | "year_selected"
  | "history_opened"
  | "random_laureate_clicked"
  | "language_changed"
  | "wikipedia_external_link_clicked";

/** Anonymous product-event tracking. No personal data is collected. */
export function trackEvent(event: AnalyticsEvent, props?: Record<string, string | number>): void {
  try {
    vercelTrack(event, props);
  } catch {
    /* analytics unavailable — never break the app */
  }
}
