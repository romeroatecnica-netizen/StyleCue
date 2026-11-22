import {CANONICAL_ORIGIN, getCanonicalUrl} from '../config/seo';
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
  const canonicalHref = getCanonicalUrl(locale);

  // Update <html lang dir>
  document.documentElement.lang = localeConfig.code;
  document.documentElement.dir = localeConfig.dir;

  // Update <title> and meta tags
  document.title = pageTitle;
  setMetaContent('meta[name="description"]', t.seo.description);
  setMetaContent('meta[property="og:title"]', pageTitle);
  setMetaContent('meta[property="og:description"]', t.seo.description);
  setMetaContent('meta[property="og:locale"]', localeConfig.ogLocale);
  setMetaContent('meta[property="og:url"]', canonicalHref);
  setMetaContent('meta[name="twitter:title"]', pageTitle);
  setMetaContent('meta[name="twitter:description"]', t.seo.description);

  const canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonicalEl) {
    canonicalEl.href = canonicalHref;
  }

  // Ensure x-default and all 10 hreflang alternate links point strictly to CANONICAL_ORIGIN
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

  upsertAlternate('x-default', `${CANONICAL_ORIGIN}/`);
  for (const loc of SUPPORTED_LOCALES) {
    upsertAlternate(loc.code, getCanonicalUrl(loc.code));
  }

  // Update dynamic JSON-LD (SoftwareApplication + FAQPage) with official canonical URL
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
          url: canonicalHref,
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
