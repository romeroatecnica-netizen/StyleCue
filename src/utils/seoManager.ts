import {getLocaleConfig} from '../i18n';
import type {TranslationDictionary} from '../i18n/types';
import {SUPPORTED_LOCALES, type AdvisoryTab, type SupportedLocale} from '../types/stylecue';

function setMetaContent(selector: string, content: string) {
  const el = document.querySelector<HTMLMetaElement>(selector);
  if (el) {
    el.setAttribute('content', content);
  }
}

export function syncDynamicSeo(
  locale: SupportedLocale,
  activeTab: AdvisoryTab,
  t: TranslationDictionary,
) {
  const localeConfig = getLocaleConfig(locale);
  const pageTitle = activeTab === 'all' ? t.seo.title : t.seo.tabTitles[activeTab];

  // Update <html lang dir>
  document.documentElement.lang = localeConfig.code;
  document.documentElement.dir = localeConfig.dir;

  // Update <title> and meta tags
  document.title = pageTitle;
  setMetaContent('meta[name="description"]', t.seo.description);
  setMetaContent('meta[property="og:title"]', pageTitle);
  setMetaContent('meta[property="og:description"]', t.seo.description);
  setMetaContent('meta[property="og:locale"]', localeConfig.ogLocale);
  setMetaContent('meta[name="twitter:title"]', pageTitle);
  setMetaContent('meta[name="twitter:description"]', t.seo.description);

  // Build canonical & hreflang URLs from current origin/pathname
  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://stylecue.pages.dev/';

  const canonicalHref = `${baseUrl}?lang=${locale}`;
  setMetaContent('meta[property="og:url"]', canonicalHref);

  const canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonicalEl) {
    canonicalEl.href = canonicalHref;
  }

  // Ensure x-default and all 10 hreflang alternate links stay accurate to current host
  const upsertAlternate = (hreflang: string, href: string) => {
    let link = document.querySelector<HTMLLinkElement>(
      `link[rel="alternate"][hreflang="${hreflang}"]`,
    );
    if (!link) {
      link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = hreflang;
      document.head.appendChild(link);
    }
    link.href = href;
  };

  upsertAlternate('x-default', `${baseUrl}?lang=en`);
  for (const loc of SUPPORTED_LOCALES) {
    upsertAlternate(loc.code, `${baseUrl}?lang=${loc.code}`);
  }

  // Update dynamic JSON-LD (SoftwareApplication + FAQPage)
  const jsonLdEl = document.getElementById('stylecue-jsonld');
  if (jsonLdEl) {
    const graph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          name: 'StyleCue',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'All',
          inLanguage: localeConfig.code,
          url: canonicalHref,
          description: t.seo.description,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        },
        {
          '@type': 'FAQPage',
          inLanguage: localeConfig.code,
          mainEntity: t.faq.items.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.a,
            },
          })),
        },
      ],
    };
    jsonLdEl.textContent = JSON.stringify(graph);
  }
}
