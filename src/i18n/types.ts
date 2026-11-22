import type {
  AdvisoryResult,
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
} from '../types/stylecue';

export interface TranslationDictionary {
  seo: {
    title: string;
    description: string;
    tabTitles: Record<'all' | 'hair' | 'makeup' | 'outfits' | 'palette', string>;
  };
  nav: {
    studio: string;
    results: string;
    guide: string;
    faq: string;
    copyLink: string;
    linkCopied: string;
    languageSelect: string;
  };
  hero: {
    kicker: string;
    h1: string;
    subtitle: string;
    zeroUploadTitle: string;
    zeroUploadBody: string;
  };
  disclaimer: {
    title: string;
    items: [string, string, string];
  };
  studio: {
    sectionTitle: string;
    sectionSubtitle: string;
    uploadDropTitle: string;
    uploadDropHint: string;
    chooseFileBtn: string;
    clearPhotoBtn: string;
    demoToggleLabel: string;
    demoPresets: Record<DemoPresetId, {label: string; note: string}>;
    canvasHeading: string;
    canvasEmpty: string;
    canvasSourcePhoto: string;
    canvasSourceDemo: string;
    metricLuminance: string;
    metricContrast: string;
    metricThermalBias: string;
    metricPixels: string;
    dominantSwatchesTitle: string;
    lightingWarnings: {
      warmCast: string;
      coolCast: string;
      lowLight: string;
      highExposure: string;
    };
    controlsTitle: string;
    resetCalibration: string;
    labels: {
      temperature: string;
      contrast: string;
      faceShape: string;
      hairLength: string;
      hairTexture: string;
      occasion: string;
      climate: string;
      makeupLevel: string;
    };
    options: {
      temperature: Record<Temperature, string>;
      contrast: Record<ContrastLevel, string>;
      faceShape: Record<FaceShape, string>;
      hairLength: Record<HairLength, string>;
      hairTexture: Record<HairTexture, string>;
      occasion: Record<Occasion, string>;
      climate: Record<Climate, string>;
      makeupLevel: Record<MakeupLevel, string>;
    };
    errorInvalidFile: string;
    errorDecode: string;
  };
  results: {
    sectionTitle: string;
    archetypeLabel: string;
    metalLabel: string;
    printBtn: string;
    tabs: {
      all: string;
      hair: string;
      makeup: string;
      outfits: string;
      palette: string;
    };
    archetypes: Record<AdvisoryResult['archetypeKey'], {name: string; summary: string}>;
    metals: Record<'gold' | 'champagne' | 'silver', string>;
    hairPillar: {
      title: string;
      kicker: string;
      cutLabel: string;
      volumeLabel: string;
      partingLabel: string;
      climateLabel: string;
      cutsByFace: Record<FaceShape, string>;
      volumeByTexture: Record<HairTexture, string>;
      partingByLength: Record<HairLength, string>;
      finishByClimate: Record<Climate, string>;
    };
    makeupPillar: {
      title: string;
      kicker: string;
      baseLabel: string;
      browsLashesLabel: string;
      cheekLipLabel: string;
      occasionNoteLabel: string;
      baseByLevel: Record<MakeupLevel, string>;
      browsByContrast: Record<ContrastLevel, string>;
      cheekLipByTemp: Record<Temperature, string>;
      occasionFinish: Record<Occasion, string>;
    };
    outfitPillar: {
      title: string;
      kicker: string;
      silhouetteLabel: string;
      necklineLabel: string;
      fabricLayerLabel: string;
      avoidLabel: string;
      silhouetteByOccasion: Record<Occasion, string>;
      necklineByFace: Record<FaceShape, string>;
      fabricByClimate: Record<Climate, string>;
      avoidByContrast: Record<ContrastLevel, string>;
    };
    palettePillar: {
      title: string;
      kicker: string;
      signatureHeading: string;
      neutralsHeading: string;
      accentsHeading: string;
      cautionHeading: string;
      copyHexHint: string;
      copiedHex: string;
      triosHeading: string;
      trioLabels: {
        anchor: string;
        tonal: string;
        statement: string;
      };
      trioRoles: {
        top: string;
        bottom: string;
        accent: string;
      };
      diagram: {
        title: string;
        subtitle: string;
        warmPole: string;
        coolPole: string;
        neutralZone: string;
        chromaLabel: string;
        contrastLabel: string;
        proportionTitle: string;
        proportion60: string;
        proportion30: string;
        proportion10: string;
      };
      colorNames: Record<string, string>;
    };
  };
  monetization: {
    adLabel: string;
    adPlaceholderNote: string;
    affiliateTitle: string;
    affiliateSubtitle: string;
    affiliateDisclosure: string;
    affiliateCta: string;
    affiliateCategories: {
      hair: {title: string; desc: string; tag: string};
      skin: {title: string; desc: string; tag: string};
      wardrobe: {title: string; desc: string; tag: string};
      colorimetry: {title: string; desc: string; tag: string};
    };
  };
  guide: {
    sectionTitle: string;
    sectionSubtitle: string;
    articles: Array<{
      title: string;
      body: string;
    }>;
  };
  faq: {
    sectionTitle: string;
    items: Array<{
      q: string;
      a: string;
    }>;
  };
  footer: {
    tagline: string;
    privacySummary: string;
    disclaimerSummary: string;
    copyright: string;
  };
}

export type TranslationsMap = Record<SupportedLocale, TranslationDictionary>;
