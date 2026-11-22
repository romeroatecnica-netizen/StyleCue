import type {TranslationDictionary} from '../i18n/types';
import {SUPPORTED_LOCALES, type SupportedLocale} from '../types/stylecue';

interface FooterProps {
  locale: SupportedLocale;
  onChangeLocale: (locale: SupportedLocale) => void;
  t: TranslationDictionary;
}

export function Footer({locale, onChangeLocale, t}: FooterProps) {
  return (
    <footer className="mt-8 border-t border-[#E7E5E4] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 md:grid-cols-12">
          <div className="space-y-2 md:col-span-7">
            <p className="font-display text-sm font-bold text-[#1C1917]">{t.footer.tagline}</p>
            <p className="text-xs leading-relaxed text-[#57534E]">{t.footer.privacySummary}</p>
            <p className="text-xs leading-relaxed text-[#57534E]">{t.footer.disclaimerSummary}</p>
          </div>

          <div className="no-print md:col-span-5">
            <p className="text-xs font-semibold text-[#1C1917]">{t.nav.languageSelect}</p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
              {SUPPORTED_LOCALES.map((loc) => {
                const active = loc.code === locale;
                return (
                  <button
                    key={loc.code}
                    type="button"
                    onClick={() => onChangeLocale(loc.code)}
                    className={`text-xs transition-colors cursor-pointer ${
                      active
                        ? 'font-semibold text-[#9F1239] underline underline-offset-4'
                        : 'text-[#57534E] hover:text-[#1C1917]'
                    }`}
                  >
                    {loc.nativeName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-[#E7E5E4] pt-5 text-xs text-[#78716C]">
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
