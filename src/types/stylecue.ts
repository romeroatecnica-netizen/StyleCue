export type SupportedLocale =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'pt'
  | 'ru'
  | 'hi'
  | 'ar'
  | 'zh'
  | 'ja';

export interface LocaleConfig {
  code: SupportedLocale;
  nativeName: string;
  englishName: string;
  dir: 'ltr' | 'rtl';
  ogLocale: string;
}

export const SUPPORTED_LOCALES: LocaleConfig[] = [
  {code: 'en', nativeName: 'English', englishName: 'English', dir: 'ltr', ogLocale: 'en_US'},
  {code: 'es', nativeName: 'Español', englishName: 'Spanish', dir: 'ltr', ogLocale: 'es_ES'},
  {code: 'fr', nativeName: 'Français', englishName: 'French', dir: 'ltr', ogLocale: 'fr_FR'},
  {code: 'de', nativeName: 'Deutsch', englishName: 'German', dir: 'ltr', ogLocale: 'de_DE'},
  {code: 'pt', nativeName: 'Português', englishName: 'Portuguese', dir: 'ltr', ogLocale: 'pt_BR'},
  {code: 'ru', nativeName: 'Русский', englishName: 'Russian', dir: 'ltr', ogLocale: 'ru_RU'},
  {code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi', dir: 'ltr', ogLocale: 'hi_IN'},
  {code: 'ar', nativeName: 'العربية', englishName: 'Arabic', dir: 'rtl', ogLocale: 'ar_SA'},
  {code: 'zh', nativeName: '中文', englishName: 'Chinese', dir: 'ltr', ogLocale: 'zh_CN'},
  {code: 'ja', nativeName: '日本語', englishName: 'Japanese', dir: 'ltr', ogLocale: 'ja_JP'},
];

export type Temperature = 'warm' | 'neutral' | 'cool';
export type ContrastLevel = 'soft' | 'medium' | 'high';
export type FaceShape = 'oval' | 'round' | 'square' | 'heart' | 'long';
export type HairLength = 'short' | 'medium' | 'long';
export type HairTexture = 'straight' | 'wavy' | 'curly' | 'coily';
export type Occasion = 'casual' | 'office' | 'evening';
export type Climate = 'warm' | 'mild' | 'cold';
export type MakeupLevel = 'none_skincare' | 'daily_luminous' | 'editorial_defined';
export type AdvisoryTab = 'all' | 'hair' | 'makeup' | 'outfits' | 'palette';
export type DemoPresetId = 'warm_olive' | 'cool_porcelain' | 'deep_contrast';

export interface UserCalibration {
  temperature: Temperature;
  contrast: ContrastLevel;
  faceShape: FaceShape;
  hairLength: HairLength;
  hairTexture: HairTexture;
  occasion: Occasion;
  climate: Climate;
  makeupLevel: MakeupLevel;
}

export interface ColorSwatch {
  hex: string;
  rgb: [number, number, number];
  percentage: number;
  label?: string;
}

export interface LightingNoticeKey {
  warmCast: boolean;
  coolCast: boolean;
  lowLight: boolean;
  highExposure: boolean;
}

export interface CanvasAnalysisResult {
  sourceType: 'photo' | 'demo';
  demoPresetId?: DemoPresetId;
  dominantColors: ColorSwatch[];
  avgLuminance: number; // 0-100
  contrastScore: number; // 0-100
  thermalBias: number; // -100 (cool) to +100 (warm)
  suggestedTemperature: Temperature;
  suggestedContrast: ContrastLevel;
  pixelsSampled: number;
  lightingFlags: LightingNoticeKey;
}

export interface PaletteColor {
  hex: string;
  nameKey: string;
}

export interface OutfitTrio {
  id: string;
  topHex: string;
  bottomHex: string;
  accentHex: string;
  topNameKey: string;
  bottomNameKey: string;
  accentNameKey: string;
}

export interface AdvisoryResult {
  archetypeKey:
    | 'warm_soft'
    | 'warm_medium'
    | 'warm_high'
    | 'neutral_soft'
    | 'neutral_medium'
    | 'neutral_high'
    | 'cool_soft'
    | 'cool_medium'
    | 'cool_high';
  metalToneKey: 'gold' | 'champagne' | 'silver';
  signatureColors: PaletteColor[];
  baseNeutrals: PaletteColor[];
  accentColors: PaletteColor[];
  cautionColors: PaletteColor[];
  outfitTrios: OutfitTrio[];
  harmonyAngleDeg: number;
  chromaSaturationPct: number;
  valueContrastPct: number;
}
