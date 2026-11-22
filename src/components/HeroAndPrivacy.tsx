import {ShieldCheck, AlertCircle} from 'lucide-react';
import type {TranslationDictionary} from '../i18n/types';

interface PrivacyAndDisclaimerProps {
  t: TranslationDictionary;
}

export function HeroAndPrivacy({t}: PrivacyAndDisclaimerProps) {
  return (
    <section id="top" className="mx-auto max-w-6xl px-4 pt-8 pb-6 sm:px-6 sm:pt-12">
      <div className="max-w-3xl">
        <p className="text-xs font-medium text-[#0F766E] tracking-wide">
          {t.hero.kicker}
        </p>
        <h1 className="mt-2.5 font-display text-3xl font-bold tracking-tight text-[#1C1917] sm:text-4xl lg:text-[2.65rem] lg:leading-[1.15] headline-balance">
          {t.hero.h1}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#44403C]">
          {t.hero.subtitle}
        </p>
      </div>

      {/* Zero-Upload Guarantee & Aesthetic Disclaimer */}
      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[#E7E5E4] bg-white p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0F766E]" aria-hidden="true" />
            <div>
              <h2 className="font-display text-sm font-semibold text-[#1C1917]">
                {t.hero.zeroUploadTitle}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[#57534E]">
                {t.hero.zeroUploadBody}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E7E5E4] bg-white p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#9F1239]" aria-hidden="true" />
            <div>
              <h2 className="font-display text-sm font-semibold text-[#1C1917]">
                {t.disclaimer.title}
              </h2>
              <ul className="mt-1.5 space-y-1.5 text-xs leading-relaxed text-[#57534E]">
                {t.disclaimer.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#A8A29E]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
