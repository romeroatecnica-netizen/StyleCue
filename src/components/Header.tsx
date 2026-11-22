import {Check, Globe, Share2} from 'lucide-react';
import type {TranslationDictionary} from '../i18n/types';
import {SUPPORTED_LOCALES, type SupportedLocale} from '../types/stylecue';

interface HeaderProps {
  locale: SupportedLocale;
  onChangeLocale: (locale: SupportedLocale) => void;
  onCopyShareLink: () => void;
  linkCopied: boolean;
  t: TranslationDictionary;
}

export function Header({
  locale,
  onChangeLocale,
  onCopyShareLink,
  linkCopied,
  t,
}: HeaderProps) {
  return (
    <header className="no-print sticky top-0 z-30 border-b border-[#E7E5E4] bg-[#FAF9F7]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:gap-8 sm:px-6">
        {/* Zone 1: Single-element brand wordmark */}
        <a
          href="#top"
          className="font-display text-xl font-bold tracking-tight text-[#1C1917] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9F1239]"
        >
          StyleCue
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#57534E]"
        >
          <a
            href="#studio"
            className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {t.nav.studio}
          </a>
          <a
            href="#results"
            className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {t.nav.results}
          </a>
          <a
            href="#guide"
            className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {t.nav.guide}
          </a>
          <a
            href="#faq"
            className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {t.nav.faq}
          </a>
        </nav>

        {/* Zone 3: Language selector & primary Share action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <label className="relative flex items-center text-xs font-medium text-[#1C1917]">
            <Globe className="pointer-events-none absolute start-2.5 h-3.5 w-3.5 text-[#57534E]" aria-hidden="true" />
            <span className="sr-only">{t.nav.languageSelect}</span>
            <select
              value={locale}
              onChange={(e) => onChangeLocale(e.target.value as SupportedLocale)}
              aria-label={t.nav.languageSelect}
              className="h-9 rounded-lg border border-[#E7E5E4] bg-white ps-8 pe-6 text-xs font-medium text-[#1C1917] transition-colors hover:border-[#D6D3D1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9F1239] cursor-pointer"
            >
              {SUPPORTED_LOCALES.map((loc) => (
                <option key={loc.code} value={loc.code}>
                  {loc.nativeName}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={onCopyShareLink}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#9F1239] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#881337] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9F1239] whitespace-nowrap shrink-0 cursor-pointer"
          >
            {linkCopied ? (
              <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <Share2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            )}
            <span>{linkCopied ? t.nav.linkCopied : t.nav.copyLink}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
