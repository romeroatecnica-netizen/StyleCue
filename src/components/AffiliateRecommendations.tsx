import {ExternalLink} from 'lucide-react';
import type {TranslationDictionary} from '../i18n/types';
import type {AdvisoryResult, UserCalibration} from '../types/stylecue';

interface AffiliateRecommendationsProps {
  advisory: AdvisoryResult;
  calibration: UserCalibration;
  t: TranslationDictionary;
}

export function AffiliateRecommendations({
  advisory,
  calibration,
  t,
}: AffiliateRecommendationsProps) {
  const archetypeName = t.results.archetypes[advisory.archetypeKey].name;

  // Contextual query terms ready to point to your configured partner/affiliate storefront URLs
  const items = [
    {
      key: 'hair' as const,
      href: `https://www.amazon.com/s?k=${encodeURIComponent(
        `${calibration.hairTexture} hair care ${calibration.climate} climate`,
      )}&tag=stylecue-20`,
      meta: t.studio.options.hairTexture[calibration.hairTexture],
    },
    {
      key: 'skin' as const,
      href: `https://www.amazon.com/s?k=${encodeURIComponent(
        `${calibration.temperature} undertone ${calibration.makeupLevel === 'none_skincare' ? 'invisible spf ceramide' : 'tinted lip balm sheer tint'}`,
      )}&tag=stylecue-20`,
      meta: t.studio.options.makeupLevel[calibration.makeupLevel],
    },
    {
      key: 'wardrobe' as const,
      href: `https://www.amazon.com/s?k=${encodeURIComponent(
        `${calibration.climate} ${calibration.occasion} capsule wardrobe essentials`,
      )}&tag=stylecue-20`,
      meta: t.studio.options.occasion[calibration.occasion],
    },
    {
      key: 'colorimetry' as const,
      href: `https://www.amazon.com/s?k=${encodeURIComponent(
        `personal color swatch fan ${calibration.temperature} undertone`,
      )}&tag=stylecue-20`,
      meta: archetypeName,
    },
  ];

  return (
    <section className="no-print mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="rounded-2xl border border-[#E7E5E4] bg-white p-5 sm:p-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-lg font-bold text-[#1C1917] sm:text-xl">
            {t.monetization.affiliateTitle}
          </h2>
          <p className="mt-1 text-sm text-[#57534E]">{t.monetization.affiliateSubtitle}</p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const copy = t.monetization.affiliateCategories[item.key];
            return (
              <a
                key={item.key}
                href={item.href}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="group flex flex-col justify-between rounded-xl border border-[#E7E5E4] bg-[#FAF9F7] p-4 transition-colors hover:border-[#9F1239]/50 hover:bg-white"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#57534E]">
                    <span className="text-[#0F766E]">{copy.tag}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{item.meta}</span>
                  </div>
                  <h3 className="mt-2 font-display text-sm font-semibold text-[#1C1917] group-hover:text-[#9F1239] transition-colors">
                    {copy.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#57534E]">{copy.desc}</p>
                </div>

                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#9F1239]">
                  <span>{t.monetization.affiliateCta}</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </a>
            );
          })}
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-[#78716C]">
          {t.monetization.affiliateDisclosure}
        </p>
      </div>
    </section>
  );
}
