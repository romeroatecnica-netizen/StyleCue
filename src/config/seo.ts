import type {SupportedLocale} from '../types/stylecue';

/**
 * Single source of truth for the official canonical production origin.
 * Never use temporary deployment hosts (*.pages.dev), preview URLs, or window.location.origin.
 */
export const CANONICAL_ORIGIN = 'https://stylecue.bastelar.com';

/**
 * Default locale ('en') resolves to the clean root URL without query parameters.
 * Other locales resolve to `https://stylecue.bastelar.com/?lang=xx`.
 */
export function getCanonicalUrl(locale: SupportedLocale): string {
  if (locale === 'en') {
    return `${CANONICAL_ORIGIN}/`;
  }
  return `${CANONICAL_ORIGIN}/?lang=${locale}`;
}
