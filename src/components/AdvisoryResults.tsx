import {useState} from 'react';
import {Scissors, Sparkles, Shirt, Palette, Printer, Check, AlertTriangle} from 'lucide-react';
import type {TranslationDictionary} from '../i18n/types';
import type {AdvisoryResult, AdvisoryTab, PaletteColor, UserCalibration} from '../types/stylecue';
import {ColorHarmonyDiagram} from './ColorHarmonyDiagram';
import {
  HairCroquisDiagram,
  MakeupCroquisDiagram,
  OutfitCroquisDiagram,
} from './CroquisIllustrations';

interface AdvisoryResultsProps {
  advisory: AdvisoryResult;
  calibration: UserCalibration;
  activeTab: AdvisoryTab;
  onChangeTab: (tab: AdvisoryTab) => void;
  t: TranslationDictionary;
}

const TAB_KEYS: AdvisoryTab[] = ['all', 'hair', 'makeup', 'outfits', 'palette'];

export function AdvisoryResults({
  advisory,
  calibration,
  activeTab,
  onChangeTab,
  t,
}: AdvisoryResultsProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      window.setTimeout(() => setCopiedHex((curr) => (curr === hex ? null : curr)), 1600);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  const archetype = t.results.archetypes[advisory.archetypeKey];
  const showHair = activeTab === 'all' || activeTab === 'hair';
  const showMakeup = activeTab === 'all' || activeTab === 'makeup';
  const showOutfits = activeTab === 'all' || activeTab === 'outfits';
  const showPalette = activeTab === 'all' || activeTab === 'palette';

  return (
    <section id="results" className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {/* Archetype Summary Header & Interactive Tabs */}
      <div className="rounded-2xl border border-[#E7E5E4] bg-white p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-5 border-b border-[#E7E5E4] pb-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-[#0F766E]">{t.results.sectionTitle}</p>
            <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#1C1917] sm:text-3xl headline-balance">
              {archetype.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#44403C]">{archetype.summary}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#57534E]">
              <span>
                <strong className="font-semibold text-[#1C1917]">{t.results.metalLabel}:</strong>{' '}
                {t.results.metals[advisory.metalToneKey]}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {t.studio.options.occasion[calibration.occasion]} /{' '}
                {t.studio.options.climate[calibration.climate]}
              </span>
            </div>
          </div>

          <div className="no-print flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E7E5E4] bg-[#FAF9F7] px-4 text-xs font-semibold text-[#1C1917] transition-colors hover:bg-[#F5F5F4] cursor-pointer whitespace-nowrap"
            >
              <Printer className="h-3.5 w-3.5 text-[#57534E]" aria-hidden="true" />
              <span>{t.results.printBtn}</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div
          role="tablist"
          aria-label={t.results.sectionTitle}
          className="no-print mt-5 flex flex-wrap gap-1.5 rounded-xl border border-[#E7E5E4] bg-[#FAF9F7] p-1.5"
        >
          {TAB_KEYS.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onChangeTab(tab)}
                className={`min-h-[38px] rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-white text-[#9F1239] shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                {t.results.tabs[tab]}
              </button>
            );
          })}
        </div>

        {/* 4 Structured Pillars */}
        <div className="mt-7 space-y-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {showHair && (
              <article className="rounded-xl border border-[#E7E5E4] bg-[#FAF9F7]/60 p-6 print-break-inside-avoid">
                <div className="flex items-start justify-between gap-4 border-b border-[#E7E5E4] pb-4 mb-4">
                  <div>
                    <p className="text-xs font-medium text-[#0F766E]">{t.results.hairPillar.kicker}</p>
                    <h3 className="mt-1 font-display text-lg font-bold text-[#1C1917]">
                      {t.results.hairPillar.title}
                    </h3>
                  </div>
                  <Scissors className="h-5 w-5 shrink-0 text-[#9F1239]" aria-hidden="true" />
                </div>

                <HairCroquisDiagram calibration={calibration} t={t} />

                <dl className="space-y-4 text-sm">
                  <PillarDetail
                    term={t.results.hairPillar.cutLabel}
                    desc={t.results.hairPillar.cutsByFace[calibration.faceShape]}
                  />
                  <PillarDetail
                    term={t.results.hairPillar.volumeLabel}
                    desc={t.results.hairPillar.volumeByTexture[calibration.hairTexture]}
                  />
                  <PillarDetail
                    term={t.results.hairPillar.partingLabel}
                    desc={t.results.hairPillar.partingByLength[calibration.hairLength]}
                  />
                  <PillarDetail
                    term={t.results.hairPillar.climateLabel}
                    desc={t.results.hairPillar.finishByClimate[calibration.climate]}
                  />
                </dl>
              </article>
            )}

            {showMakeup && (
              <article className="rounded-xl border border-[#E7E5E4] bg-[#FAF9F7]/60 p-6 print-break-inside-avoid">
                <div className="flex items-start justify-between gap-4 border-b border-[#E7E5E4] pb-4 mb-4">
                  <div>
                    <p className="text-xs font-medium text-[#0F766E]">{t.results.makeupPillar.kicker}</p>
                    <h3 className="mt-1 font-display text-lg font-bold text-[#1C1917]">
                      {t.results.makeupPillar.title}
                    </h3>
                  </div>
                  <Sparkles className="h-5 w-5 shrink-0 text-[#9F1239]" aria-hidden="true" />
                </div>

                <MakeupCroquisDiagram calibration={calibration} advisory={advisory} t={t} />

                <dl className="space-y-4 text-sm">
                  <PillarDetail
                    term={t.results.makeupPillar.baseLabel}
                    desc={t.results.makeupPillar.baseByLevel[calibration.makeupLevel]}
                  />
                  <PillarDetail
                    term={t.results.makeupPillar.browsLashesLabel}
                    desc={t.results.makeupPillar.browsByContrast[calibration.contrast]}
                  />
                  <PillarDetail
                    term={t.results.makeupPillar.cheekLipLabel}
                    desc={t.results.makeupPillar.cheekLipByTemp[calibration.temperature]}
                  />
                  <PillarDetail
                    term={t.results.makeupPillar.occasionNoteLabel}
                    desc={t.results.makeupPillar.occasionFinish[calibration.occasion]}
                  />
                </dl>
              </article>
            )}

            {showOutfits && (
              <article className="rounded-xl border border-[#E7E5E4] bg-[#FAF9F7]/60 p-6 print-break-inside-avoid lg:col-span-2">
                <div className="flex items-start justify-between gap-4 border-b border-[#E7E5E4] pb-4 mb-4">
                  <div>
                    <p className="text-xs font-medium text-[#0F766E]">{t.results.outfitPillar.kicker}</p>
                    <h3 className="mt-1 font-display text-lg font-bold text-[#1C1917]">
                      {t.results.outfitPillar.title}
                    </h3>
                  </div>
                  <Shirt className="h-5 w-5 shrink-0 text-[#9F1239]" aria-hidden="true" />
                </div>

                <OutfitCroquisDiagram calibration={calibration} advisory={advisory} t={t} />

                <dl className="grid gap-5 text-sm md:grid-cols-2">
                  <PillarDetail
                    term={t.results.outfitPillar.silhouetteLabel}
                    desc={t.results.outfitPillar.silhouetteByOccasion[calibration.occasion]}
                  />
                  <PillarDetail
                    term={t.results.outfitPillar.necklineLabel}
                    desc={t.results.outfitPillar.necklineByFace[calibration.faceShape]}
                  />
                  <PillarDetail
                    term={t.results.outfitPillar.fabricLayerLabel}
                    desc={t.results.outfitPillar.fabricByClimate[calibration.climate]}
                  />
                  <PillarDetail
                    term={t.results.outfitPillar.avoidLabel}
                    desc={t.results.outfitPillar.avoidByContrast[calibration.contrast]}
                  />
                </dl>
              </article>
            )}
          </div>

          {showPalette && (
            <article className="space-y-6 rounded-xl border border-[#E7E5E4] bg-white p-6 print-break-inside-avoid">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E7E5E4] pb-4">
                <div>
                  <p className="text-xs font-medium text-[#0F766E]">{t.results.palettePillar.kicker}</p>
                  <h3 className="mt-1 font-display text-lg font-bold text-[#1C1917]">
                    {t.results.palettePillar.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#57534E]">
                  <Palette className="h-4 w-4 text-[#9F1239]" aria-hidden="true" />
                  <span>{t.results.palettePillar.copyHexHint}</span>
                </div>
              </div>

              {/* SVG/CSS Harmony & Proportion Diagram */}
              <ColorHarmonyDiagram advisory={advisory} calibration={calibration} t={t} />

              {/* Swatch Grids */}
              <div className="grid gap-6 lg:grid-cols-2">
                <SwatchGroup
                  title={t.results.palettePillar.signatureHeading}
                  colors={advisory.signatureColors}
                  copiedHex={copiedHex}
                  onCopy={handleCopyHex}
                  t={t}
                />
                <SwatchGroup
                  title={t.results.palettePillar.neutralsHeading}
                  colors={advisory.baseNeutrals}
                  copiedHex={copiedHex}
                  onCopy={handleCopyHex}
                  t={t}
                />
                <SwatchGroup
                  title={t.results.palettePillar.accentsHeading}
                  colors={advisory.accentColors}
                  copiedHex={copiedHex}
                  onCopy={handleCopyHex}
                  t={t}
                />
                <SwatchGroup
                  title={t.results.palettePillar.cautionHeading}
                  colors={advisory.cautionColors}
                  copiedHex={copiedHex}
                  onCopy={handleCopyHex}
                  muted
                  t={t}
                />
              </div>

              {/* Ready-to-Wear 3-Color Outfit Trios */}
              <div className="border-t border-[#E7E5E4] pt-6">
                <h4 className="font-display text-base font-bold text-[#1C1917]">
                  {t.results.palettePillar.triosHeading}
                </h4>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {advisory.outfitTrios.map((trio) => {
                    const trioLabel =
                      t.results.palettePillar.trioLabels[
                        trio.id as keyof typeof t.results.palettePillar.trioLabels
                      ];
                    return (
                      <div
                        key={trio.id}
                        className="rounded-xl border border-[#E7E5E4] bg-[#FAF9F7] p-4"
                      >
                        <p className="font-display text-xs font-bold text-[#1C1917]">
                          {trioLabel}
                        </p>
                        <div className="mt-3 flex h-8 w-full overflow-hidden rounded-lg border border-black/10">
                          <div style={{width: '60%', backgroundColor: trio.topHex}} />
                          <div style={{width: '30%', backgroundColor: trio.bottomHex}} />
                          <div style={{width: '10%', backgroundColor: trio.accentHex}} />
                        </div>
                        <ul className="mt-3 space-y-1.5 text-xs text-[#44403C]">
                          <li className="flex items-center justify-between gap-2">
                            <span className="truncate">{t.results.palettePillar.trioRoles.top}</span>
                            <span className="font-mono-tabular text-[11px] text-[#57534E]">
                              {t.results.palettePillar.colorNames[trio.topNameKey] ?? trio.topHex} ·{' '}
                              {trio.topHex}
                            </span>
                          </li>
                          <li className="flex items-center justify-between gap-2">
                            <span className="truncate">
                              {t.results.palettePillar.trioRoles.bottom}
                            </span>
                            <span className="font-mono-tabular text-[11px] text-[#57534E]">
                              {t.results.palettePillar.colorNames[trio.bottomNameKey] ??
                                trio.bottomHex}{' '}
                              · {trio.bottomHex}
                            </span>
                          </li>
                          <li className="flex items-center justify-between gap-2">
                            <span className="truncate">
                              {t.results.palettePillar.trioRoles.accent}
                            </span>
                            <span className="font-mono-tabular text-[11px] text-[#57534E]">
                              {t.results.palettePillar.colorNames[trio.accentNameKey] ??
                                trio.accentHex}{' '}
                              · {trio.accentHex}
                            </span>
                          </li>
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}

function PillarDetail({term, desc}: {term: string; desc: string}) {
  return (
    <div className="border-b border-[#E7E5E4]/80 pb-3 last:border-b-0 last:pb-0">
      <dt className="font-display text-xs font-semibold text-[#1C1917]">{term}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-[#44403C]">{desc}</dd>
    </div>
  );
}

function SwatchGroup({
  title,
  colors,
  copiedHex,
  onCopy,
  muted = false,
  t,
}: {
  title: string;
  colors: PaletteColor[];
  copiedHex: string | null;
  onCopy: (hex: string) => void;
  muted?: boolean;
  t: TranslationDictionary;
}) {
  return (
    <div>
      <h4 className="flex items-center gap-1.5 font-display text-sm font-semibold text-[#1C1917]">
        {muted ? (
          <AlertTriangle className="h-3.5 w-3.5 text-[#B45309]" aria-hidden="true" />
        ) : (
          <Check className="h-3.5 w-3.5 text-[#0F766E]" aria-hidden="true" />
        )}
        <span>{title}</span>
      </h4>
      <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {colors.map((color) => {
          const isCopied = copiedHex === color.hex;
          const localizedName =
            t.results.palettePillar.colorNames[color.nameKey] ?? color.nameKey;
          return (
            <button
              key={color.hex}
              type="button"
              onClick={() => onCopy(color.hex)}
              className={`group flex items-center gap-2.5 rounded-lg border border-[#E7E5E4] bg-[#FAF9F7] p-2 text-start transition-colors hover:border-[#D6D3D1] cursor-pointer ${
                muted ? 'opacity-80' : ''
              }`}
              title={`${localizedName} (${color.hex})`}
            >
              <span
                className="h-9 w-9 shrink-0 rounded-md border border-black/10"
                style={{backgroundColor: color.hex}}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-[#1C1917]">
                  {localizedName}
                </span>
                <span className="mt-0.5 flex items-center gap-1 font-mono-tabular text-[11px] text-[#57534E]">
                  {isCopied ? (
                    <>
                      <Check className="h-3 w-3 text-[#0F766E]" aria-hidden="true" />
                      <span className="text-[#0F766E]">{t.results.palettePillar.copiedHex}</span>
                    </>
                  ) : (
                    <span>{color.hex}</span>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
