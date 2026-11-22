import {useEffect} from 'react';
import type {TranslationDictionary} from '../i18n/types';

declare global {
  interface Window {
    _mNHandle?: {
      queue?: Array<() => void>;
    };
    _mNDetails?: {
      loadTag?: (adId: string, size: string, containerId: string) => void;
    };
  }
}

interface AdSlotProps {
  /** Unique DOM container ID for Media.net ad tag */
  slotId: string;
  /** Media.net size string (e.g. '728x90' or '300x250') */
  adSize?: string;
  /** Variant controls reserved min-height to prevent Cumulative Layout Shift (CLS) */
  variant: 'leaderboard' | 'bottom';
  t: TranslationDictionary;
}

/**
 * Media.net Pre-Configured Ad Container
 * --------------------------------------------------------------------------
 * Integration instructions for production:
 * 1. Add your Media.net <script> header snippet in index.html with your `cid`.
 * 2. Replace `data-medianet-crid` below with your real Media.net `crid` ID.
 * 3. Reserved min-height (100px / 250px) ensures zero Cumulative Layout Shift.
 * 4. Wrapped in `.no-print` so ads never appear when users print or save PDF.
 */
export function AdSlot({slotId, adSize = '728x90', variant, t}: AdSlotProps) {
  useEffect(() => {
    // Safe non-blocking hook when Media.net script is present in production
    if (typeof window !== 'undefined' && window._mNHandle?.queue && window._mNDetails?.loadTag) {
      window._mNHandle.queue.push(() => {
        try {
          window._mNDetails?.loadTag?.(slotId, adSize, slotId);
        } catch {
          // Silently ignore if ad script is blocked or not yet configured
        }
      });
    }
  }, [slotId, adSize]);

  const minHeightClass = variant === 'leaderboard' ? 'min-h-[104px]' : 'min-h-[250px]';

  return (
    <aside
      aria-label={t.monetization.adLabel}
      className="no-print mx-auto max-w-6xl px-4 py-4 sm:px-6"
    >
      <div
        className={`flex flex-col items-center justify-center rounded-xl border border-[#E7E5E4] bg-[#F5F4F1] p-4 text-center ${minHeightClass}`}
      >
        <span className="text-[11px] font-medium tracking-wide text-[#78716C]">
          {t.monetization.adLabel}
        </span>

        {/* Media.net Target Mount Container */}
        <div
          id={slotId}
          data-medianet-slot={slotId}
          data-medianet-size={adSize}
          data-medianet-crid="YOUR_MEDIANET_CRID"
          className="mt-1.5 flex w-full items-center justify-center"
        >
          <p className="max-w-md text-xs text-[#78716C]">{t.monetization.adPlaceholderNote}</p>
        </div>
      </div>
    </aside>
  );
}
