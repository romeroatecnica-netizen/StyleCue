import {ExternalLink} from 'lucide-react';
import {buildAmazonEsSearchUrl} from '../config/affiliate';
import type {TranslationDictionary} from '../i18n/types';
import type {AdvisoryResult, UserCalibration} from '../types/stylecue';

export type AffiliateCategoryKey = 'hair' | 'skin' | 'wardrobe' | 'colorimetry';

function getSpanishHairQuery(calibration: UserCalibration): string {
  const textureMap: Record<UserCalibration['hairTexture'], string> = {
    straight: 'cepillo cerdas naturales serum capilar ligero',
    wavy: 'crema definicion ondas cabello sin apelmazar',
    curly: 'crema rizos definicion control encrespamiento',
    coily: 'mascarilla hidratante intensa cabello rizado afro',
  };
  const climateSuffix: Record<UserCalibration['climate'], string> = {
    warm: 'antihumedad',
    mild: 'uso diario',
    cold: 'nutritivo',
  };
  return `${textureMap[calibration.hairTexture]} ${climateSuffix[calibration.climate]}`;
}

function getSpanishSkinQuery(calibration: UserCalibration): string {
  if (calibration.makeupLevel === 'none_skincare') {
    return 'protector solar facial invisible fluido crema ceramidas';
  }
  if (calibration.makeupLevel === 'editorial_defined') {
    return calibration.temperature === 'warm'
      ? 'lapiz cejas resistente rubor melocoton iluminador'
      : 'lapiz cejas preciso rubor rosa iluminador satinado';
  }
  if (calibration.temperature === 'warm') {
    return 'balsamo labial con color melocoton tint hidratante';
  }
  if (calibration.temperature === 'cool') {
    return 'balsamo labial con color frambuesa rubor rosa frio';
  }
  return 'tinte labial palo de rosa hidratante facial ligero';
}

function getSpanishWardrobeQuery(calibration: UserCalibration): string {
  if (calibration.occasion === 'evening') {
    return calibration.climate === 'cold'
      ? 'blazer sastre elegante lana pantalon vestir'
      : 'blazer elegante fluido pantalon pinzas';
  }
  if (calibration.climate === 'warm') {
    return calibration.occasion === 'office'
      ? 'camisa popelin algodon pantalon pinzas verano'
      : 'camisa lino transpirable algodon';
  }
  if (calibration.climate === 'cold') {
    return 'jersey cachemir lana abrigo pano';
  }
  return calibration.occasion === 'office'
    ? 'jersey lana merino fino pantalon sastre'
    : 'gabardina basica camisa algodon';
}

function getSpanishColorimetryQuery(calibration: UserCalibration): string {
  if (calibration.temperature === 'warm') {
    return 'abanico colorimetria personal tonos calidos telas';
  }
  if (calibration.temperature === 'cool') {
    return 'abanico colorimetria personal tonos frios telas';
  }
  return 'guia colorimetria personal abanico muestras telas';
}

function getCategoryUrl(
  category: AffiliateCategoryKey,
  calibration: UserCalibration,
): string {
  switch (category) {
    case 'hair':
      return buildAmazonEsSearchUrl(getSpanishHairQuery(calibration));
    case 'skin':
      return buildAmazonEsSearchUrl(getSpanishSkinQuery(calibration));
    case 'wardrobe':
      return buildAmazonEsSearchUrl(getSpanishWardrobeQuery(calibration));
    case 'colorimetry':
      return buildAmazonEsSearchUrl(getSpanishColorimetryQuery(calibration));
  }
}

function getCategoryMeta(
  category: AffiliateCategoryKey,
  calibration: UserCalibration,
  advisory: AdvisoryResult,
  t: TranslationDictionary,
): string {
  switch (category) {
    case 'hair':
      return t.studio.options.hairTexture[calibration.hairTexture];
    case 'skin':
      return t.studio.options.makeupLevel[calibration.makeupLevel];
    case 'wardrobe':
      return t.studio.options.occasion[calibration.occasion];
    case 'colorimetry':
      return t.results.archetypes[advisory.archetypeKey].name;
  }
}

interface PillarAffiliateLinkProps {
  category: AffiliateCategoryKey;
  calibration: UserCalibration;
  advisory: AdvisoryResult;
  t: TranslationDictionary;
}

/**
 * Contextual Amazon.es affiliate card placed directly inside the matching advisory pillar.
 * Always enforces https://www.amazon.es + tag=bastelar-21 and rel="sponsored nofollow noopener".
 */
export function PillarAffiliateLink({
  category,
  calibration,
  advisory,
  t,
}: PillarAffiliateLinkProps) {
  const copy = t.monetization.affiliateCategories[category];
  const href = getCategoryUrl(category, calibration);
  const meta = getCategoryMeta(category, calibration, advisory, t);

  return (
    <div className="no-print mt-5 border-t border-[#E7E5E4] pt-4">
      <a
        href={href}
        target="_blank"
        rel="sponsored nofollow noopener"
        className="group flex flex-col justify-between gap-3 rounded-lg border border-[#E7E5E4] bg-white px-3.5 py-3 transition-colors hover:border-[#9F1239]/50 sm:flex-row sm:items-center"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#57534E]">
            <span className="text-[#0F766E]">Amazon.es</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{meta}</span>
          </div>
          <p className="mt-0.5 text-xs font-semibold text-[#1C1917] group-hover:text-[#9F1239] transition-colors">
            {copy.title}
          </p>
          <p className="mt-0.5 text-[11px] leading-snug text-[#57534E]">{copy.desc}</p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9F1239] whitespace-nowrap shrink-0">
          <span>{t.monetization.affiliateCta}</span>
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </a>
    </div>
  );
}

export function AffiliateDisclosureFooter({t}: {t: TranslationDictionary}) {
  return (
    <p className="no-print mt-6 border-t border-[#E7E5E4] pt-4 text-[11px] leading-relaxed text-[#78716C]">
      {t.monetization.affiliateDisclosure}
    </p>
  );
}
