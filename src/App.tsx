import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {AdSlot} from './components/AdSlot';
import {AdvisoryResults} from './components/AdvisoryResults';
import {AffiliateRecommendations} from './components/AffiliateRecommendations';
import {EditorialGuideAndFaq} from './components/EditorialGuideAndFaq';
import {Footer} from './components/Footer';
import {Header} from './components/Header';
import {HeroAndPrivacy} from './components/HeroAndPrivacy';
import {PhotoCalibrationStudio} from './components/PhotoCalibrationStudio';
import {TRANSLATIONS, detectInitialLocale, isSupportedLocale} from './i18n';
import type {
  AdvisoryTab,
  CanvasAnalysisResult,
  Climate,
  ContrastLevel,
  DemoPresetId,
  FaceShape,
  HairLength,
  HairTexture,
  MakeupLevel,
  Occasion,
  SupportedLocale,
  Temperature,
  UserCalibration,
} from './types/stylecue';
import {generateAdvisory} from './utils/advisoryEngine';
import {DEMO_PRESETS, analyzeImageLocally} from './utils/canvasAnalyzer';
import {syncDynamicSeo} from './utils/seoManager';

const STORAGE_KEY = 'stylecue_prefs_v1';

const DEFAULT_CALIBRATION: UserCalibration = {
  temperature: 'warm',
  contrast: 'medium',
  faceShape: 'oval',
  hairLength: 'medium',
  hairTexture: 'wavy',
  occasion: 'casual',
  climate: 'mild',
  makeupLevel: 'daily_luminous',
};

interface StoredPreferences {
  locale?: SupportedLocale;
  calibration?: Partial<UserCalibration>;
}

function readStoredPreferences(): StoredPreferences {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredPreferences;
  } catch {
    return {};
  }
}

function isValidEnum<T extends string>(val: string | null, allowed: readonly T[]): val is T {
  return val !== null && (allowed as readonly string[]).includes(val);
}

export default function App() {
  const stored = useMemo(() => readStoredPreferences(), []);
  const urlParams = useMemo(
    () =>
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams(),
    [],
  );

  const [locale, setLocale] = useState<SupportedLocale>(() =>
    detectInitialLocale(urlParams.get('lang'), stored.locale),
  );

  const [calibration, setCalibration] = useState<UserCalibration>(() => {
    const base: UserCalibration = {
      ...DEFAULT_CALIBRATION,
      ...(stored.calibration ?? {}),
    };

    const qOccasion = urlParams.get('occasion');
    if (isValidEnum<Occasion>(qOccasion, ['casual', 'office', 'evening'])) {
      base.occasion = qOccasion;
    }
    const qTemp = urlParams.get('temp');
    if (isValidEnum<Temperature>(qTemp, ['warm', 'neutral', 'cool'])) {
      base.temperature = qTemp;
    }
    const qContrast = urlParams.get('contrast');
    if (isValidEnum<ContrastLevel>(qContrast, ['soft', 'medium', 'high'])) {
      base.contrast = qContrast;
    }
    const qClimate = urlParams.get('climate');
    if (isValidEnum<Climate>(qClimate, ['warm', 'mild', 'cold'])) {
      base.climate = qClimate;
    }
    const qFace = urlParams.get('face');
    if (isValidEnum<FaceShape>(qFace, ['oval', 'round', 'square', 'heart', 'long'])) {
      base.faceShape = qFace;
    }
    const qHairLen = urlParams.get('hairLen');
    if (isValidEnum<HairLength>(qHairLen, ['short', 'medium', 'long'])) {
      base.hairLength = qHairLen;
    }
    const qHairTex = urlParams.get('hairTex');
    if (isValidEnum<HairTexture>(qHairTex, ['straight', 'wavy', 'curly', 'coily'])) {
      base.hairTexture = qHairTex;
    }
    const qMakeup = urlParams.get('makeup');
    if (
      isValidEnum<MakeupLevel>(qMakeup, ['none_skincare', 'daily_luminous', 'editorial_defined'])
    ) {
      base.makeupLevel = qMakeup;
    }

    return base;
  });

  const [activeTab, setActiveTab] = useState<AdvisoryTab>('all');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [activeDemoPreset, setActiveDemoPreset] = useState<DemoPresetId>('warm_olive');
  const [analysis, setAnalysis] = useState<CanvasAnalysisResult | null>(
    () => DEMO_PRESETS.warm_olive.analysis,
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const previewUrlRef = useRef<string | null>(null);

  const t = TRANSLATIONS[locale];

  // Clean up volatile Object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  // Persist ONLY non-sensitive preferences (never photos) in localStorage
  useEffect(() => {
    try {
      const payload: StoredPreferences = {
        locale,
        calibration,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota / private mode restrictions
    }
  }, [locale, calibration]);

  // Keep SEO metadata, lang, dir, hreflang & JSON-LD synchronized
  useEffect(() => {
    syncDynamicSeo(locale, activeTab, t);
  }, [locale, activeTab, t]);

  const handleFileSelected = useCallback(
    async (file: File) => {
      setUploadError(null);
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!file.type.startsWith('image/') && !validTypes.includes(file.type)) {
        setUploadError(t.studio.errorInvalidFile);
        return;
      }

      try {
        const result = await analyzeImageLocally(file);

        if (previewUrlRef.current) {
          URL.revokeObjectURL(previewUrlRef.current);
        }
        previewUrlRef.current = result.previewUrl;

        setPreviewUrl(result.previewUrl);
        setIsDemoMode(false);
        setAnalysis(result.analysis);
        setCalibration((prev) => ({
          ...prev,
          temperature: result.analysis.suggestedTemperature,
          contrast: result.analysis.suggestedContrast,
        }));
      } catch {
        setUploadError(t.studio.errorDecode);
      }
    },
    [t.studio.errorDecode, t.studio.errorInvalidFile],
  );

  const handleClearPhoto = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
    setUploadError(null);
    setIsDemoMode(true);
    setAnalysis(DEMO_PRESETS[activeDemoPreset].analysis);
  }, [activeDemoPreset]);

  const handleSelectDemoPreset = useCallback((presetId: DemoPresetId) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
    setUploadError(null);
    setIsDemoMode(true);
    setActiveDemoPreset(presetId);

    const preset = DEMO_PRESETS[presetId];
    setAnalysis(preset.analysis);
    setCalibration((prev) => ({
      ...prev,
      temperature: preset.defaults.temperature,
      contrast: preset.defaults.contrast,
    }));
  }, []);

  const handleUpdateCalibration = useCallback(
    <K extends keyof UserCalibration>(key: K, value: UserCalibration[K]) => {
      setCalibration((prev) => ({...prev, [key]: value}));
    },
    [],
  );

  const handleResetCalibration = useCallback(() => {
    if (analysis && analysis.sourceType === 'photo') {
      setCalibration({
        ...DEFAULT_CALIBRATION,
        temperature: analysis.suggestedTemperature,
        contrast: analysis.suggestedContrast,
      });
    } else {
      setIsDemoMode(true);
      setActiveDemoPreset('warm_olive');
      setAnalysis(DEMO_PRESETS.warm_olive.analysis);
      setCalibration(DEFAULT_CALIBRATION);
    }
  }, [analysis]);

  const handleChangeLocale = useCallback((nextLocale: SupportedLocale) => {
    if (!isSupportedLocale(nextLocale)) return;
    setLocale(nextLocale);
    try {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set('lang', nextLocale);
      window.history.replaceState({}, '', nextUrl.toString());
    } catch {
      // Ignore history API errors in restricted contexts
    }
  }, []);

  const handleCopyShareLink = useCallback(async () => {
    try {
      const shareUrl = new URL(window.location.href);
      shareUrl.searchParams.set('lang', locale);
      shareUrl.searchParams.set('occasion', calibration.occasion);
      shareUrl.searchParams.set('temp', calibration.temperature);
      shareUrl.searchParams.set('contrast', calibration.contrast);
      shareUrl.searchParams.set('climate', calibration.climate);

      await navigator.clipboard.writeText(shareUrl.toString());
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 1800);
    } catch {
      // Clipboard fallback ignored
    }
  }, [locale, calibration]);

  const advisory = useMemo(() => generateAdvisory(calibration), [calibration]);

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917]">
      <Header
        locale={locale}
        onChangeLocale={handleChangeLocale}
        onCopyShareLink={handleCopyShareLink}
        linkCopied={linkCopied}
        t={t}
      />

      <main>
        <HeroAndPrivacy t={t} />

        <PhotoCalibrationStudio
          previewUrl={previewUrl}
          analysis={analysis}
          calibration={calibration}
          isDemoMode={isDemoMode}
          activeDemoPreset={activeDemoPreset}
          uploadError={uploadError}
          onFileSelected={handleFileSelected}
          onClearPhoto={handleClearPhoto}
          onSelectDemoPreset={handleSelectDemoPreset}
          onUpdateCalibration={handleUpdateCalibration}
          onResetCalibration={handleResetCalibration}
          t={t}
        />

        <AdvisoryResults
          advisory={advisory}
          calibration={calibration}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          t={t}
        />

        {/* Media.net Placement 1: Between main advisory results and editorial guide */}
        <AdSlot
          slotId="medianet-ad-stylecue-mid"
          adSize="728x90"
          variant="leaderboard"
          t={t}
        />

        <AffiliateRecommendations
          advisory={advisory}
          calibration={calibration}
          t={t}
        />

        <EditorialGuideAndFaq t={t} />

        {/* Media.net Placement 2: Bottom of page before footer */}
        <AdSlot
          slotId="medianet-ad-stylecue-bottom"
          adSize="300x250"
          variant="bottom"
          t={t}
        />
      </main>

      <Footer locale={locale} onChangeLocale={handleChangeLocale} t={t} />
    </div>
  );
}
