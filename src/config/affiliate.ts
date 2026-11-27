/**
 * Centralized Amazon Spain (amazon.es) Affiliate configuration & URL enforcer.
 */
export const AMAZON_ES_ORIGIN = 'https://www.amazon.es';
export const AMAZON_AFFILIATE_TAG = 'bastelar-21';

/**
 * Forces any Amazon URL to use https://www.amazon.es and the official tag=bastelar-21 parameter.
 */
export function enforceAmazonEsAffiliateUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl, AMAZON_ES_ORIGIN);
    parsed.protocol = 'https:';
    parsed.hostname = 'www.amazon.es';
    parsed.port = '';
    parsed.searchParams.set('tag', AMAZON_AFFILIATE_TAG);
    return parsed.toString();
  } catch {
    const fallback = new URL('/s', AMAZON_ES_ORIGIN);
    fallback.searchParams.set('k', rawUrl);
    fallback.searchParams.set('tag', AMAZON_AFFILIATE_TAG);
    return fallback.toString();
  }
}

/**
 * Builds a clean search URL exclusively on https://www.amazon.es with tag=bastelar-21.
 */
export function buildAmazonEsSearchUrl(query: string): string {
  const url = new URL('/s', AMAZON_ES_ORIGIN);
  url.searchParams.set('k', query.trim());
  url.searchParams.set('tag', AMAZON_AFFILIATE_TAG);
  return enforceAmazonEsAffiliateUrl(url.toString());
}
