import type {AdvisoryResult, PaletteColor, UserCalibration} from '../types/stylecue';

interface ArchetypePaletteSpec {
  metalToneKey: 'gold' | 'champagne' | 'silver';
  signatureColors: PaletteColor[];
  baseNeutrals: PaletteColor[];
  accentColors: PaletteColor[];
  cautionColors: PaletteColor[];
  harmonyAngleDeg: number;
  chromaSaturationPct: number;
  valueContrastPct: number;
}

const PALETTE_SPECS: Record<AdvisoryResult['archetypeKey'], ArchetypePaletteSpec> = {
  warm_soft: {
    metalToneKey: 'gold',
    harmonyAngleDeg: 38,
    chromaSaturationPct: 48,
    valueContrastPct: 36,
    signatureColors: [
      {hex: '#B97754', nameKey: 'terracotta_soft'},
      {hex: '#7A8450', nameKey: 'olive_moss'},
      {hex: '#C9974F', nameKey: 'ochre_honey'},
      {hex: '#5D7B73', nameKey: 'sage_eucalyptus'},
      {hex: '#9E5A52', nameKey: 'muted_brick'},
      {hex: '#D4A383', nameKey: 'apricot_sand'},
    ],
    baseNeutrals: [
      {hex: '#F3ECE1', nameKey: 'oat_cream'},
      {hex: '#C4B39D', nameKey: 'warm_taupe'},
      {hex: '#6E5A4B', nameKey: 'cocoa_espresso'},
      {hex: '#3F3A34', nameKey: 'charcoal_peat'},
    ],
    accentColors: [
      {hex: '#C68B3C', nameKey: 'brushed_gold'},
      {hex: '#A84838', nameKey: 'spiced_rust'},
      {hex: '#386C65', nameKey: 'warm_teal'},
    ],
    cautionColors: [
      {hex: '#111111', nameKey: 'stark_black'},
      {hex: '#CBD5E1', nameKey: 'icy_silver'},
      {hex: '#D946EF', nameKey: 'neon_magenta'},
    ],
  },
  warm_medium: {
    metalToneKey: 'gold',
    harmonyAngleDeg: 32,
    chromaSaturationPct: 64,
    valueContrastPct: 58,
    signatureColors: [
      {hex: '#A94A32', nameKey: 'burnt_sienna'},
      {hex: '#2F6B5D', nameKey: 'forest_teal'},
      {hex: '#C57D28', nameKey: 'amber_marigold'},
      {hex: '#8C3B4A', nameKey: 'warm_garnet'},
      {hex: '#5B6E3A', nameKey: 'laurel_olive'},
      {hex: '#D47B5B', nameKey: 'coral_clay'},
    ],
    baseNeutrals: [
      {hex: '#FAF3E7', nameKey: 'ivory_linen'},
      {hex: '#B79F82', nameKey: 'camel_sand'},
      {hex: '#523C2D', nameKey: 'roasted_chestnut'},
      {hex: '#283137', nameKey: 'deep_petrol'},
    ],
    accentColors: [
      {hex: '#D49B35', nameKey: 'burnished_gold'},
      {hex: '#B45309', nameKey: 'copper_amber'},
      {hex: '#0F766E', nameKey: 'deep_jade'},
    ],
    cautionColors: [
      {hex: '#E2E8F0', nameKey: 'frost_white'},
      {hex: '#93C5FD', nameKey: 'pastel_ice_blue'},
      {hex: '#6B7280', nameKey: 'ash_slate'},
    ],
  },
  warm_high: {
    metalToneKey: 'gold',
    harmonyAngleDeg: 26,
    chromaSaturationPct: 78,
    valueContrastPct: 82,
    signatureColors: [
      {hex: '#B91C1C', nameKey: 'crimson_poppy'},
      {hex: '#0D7A6E', nameKey: 'vivid_emerald_teal'},
      {hex: '#D97706', nameKey: 'saffron_gold'},
      {hex: '#9F1239', nameKey: 'ruby_berry'},
      {hex: '#1E4D40', nameKey: 'rich_pine'},
      {hex: '#E05A47', nameKey: 'warm_vermilion'},
    ],
    baseNeutrals: [
      {hex: '#FDF9F1', nameKey: 'warm_alabaster'},
      {hex: '#9E8267', nameKey: 'toasted_camel'},
      {hex: '#3A281E', nameKey: 'dark_mahogany'},
      {hex: '#1C1917', nameKey: 'warm_obsidian'},
    ],
    accentColors: [
      {hex: '#EAB308', nameKey: 'bright_gold'},
      {hex: '#0F766E', nameKey: 'peacock_teal'},
      {hex: '#C2410C', nameKey: 'tangerine_rust'},
    ],
    cautionColors: [
      {hex: '#9CA3AF', nameKey: 'dusty_grey'},
      {hex: '#D8B4FE', nameKey: 'washed_lilac'},
      {hex: '#B8B0A4', nameKey: 'muddy_beige'},
    ],
  },
  neutral_soft: {
    metalToneKey: 'champagne',
    harmonyAngleDeg: 85,
    chromaSaturationPct: 44,
    valueContrastPct: 38,
    signatureColors: [
      {hex: '#7C8A82', nameKey: 'mineral_sage'},
      {hex: '#A8747A', nameKey: 'dusty_rosewood'},
      {hex: '#5D768A', nameKey: 'slate_denim'},
      {hex: '#8C7A93', nameKey: 'smoky_mauve'},
      {hex: '#B39278', nameKey: 'soft_pecan'},
      {hex: '#4E7B78', nameKey: 'muted_seafoam'},
    ],
    baseNeutrals: [
      {hex: '#F6F3EE', nameKey: 'chalk_stone'},
      {hex: '#C7BFB5', nameKey: 'greige_stone'},
      {hex: '#67615D', nameKey: 'soft_graphite'},
      {hex: '#31363B', nameKey: 'slate_navy'},
    ],
    accentColors: [
      {hex: '#C8AE8D', nameKey: 'champagne_gold'},
      {hex: '#8D4E5E', nameKey: 'muted_plum'},
      {hex: '#2F6F6D', nameKey: 'slate_teal'},
    ],
    cautionColors: [
      {hex: '#F97316', nameKey: 'acid_orange'},
      {hex: '#22D3EE', nameKey: 'electric_cyan'},
      {hex: '#000000', nameKey: 'jet_black'},
    ],
  },
  neutral_medium: {
    metalToneKey: 'champagne',
    harmonyAngleDeg: 92,
    chromaSaturationPct: 60,
    valueContrastPct: 60,
    signatureColors: [
      {hex: '#9F1239', nameKey: 'soft_wine'},
      {hex: '#0F766E', nameKey: 'balanced_teal'},
      {hex: '#3B5978', nameKey: 'indigo_slate'},
      {hex: '#B45309', nameKey: 'warm_cognac'},
      {hex: '#5C6F5B', nameKey: 'botanical_green'},
      {hex: '#8B5A6E', nameKey: 'fig_plum'},
    ],
    baseNeutrals: [
      {hex: '#FAF8F5', nameKey: 'soft_ecru'},
      {hex: '#B6AEA4', nameKey: 'taupe_stone'},
      {hex: '#4A4744', nameKey: 'charcoal_umber'},
      {hex: '#1E293B', nameKey: 'midnight_slate'},
    ],
    accentColors: [
      {hex: '#B89B72', nameKey: 'soft_champagne'},
      {hex: '#9F1239', nameKey: 'rose_berry'},
      {hex: '#0F766E', nameKey: 'emerald_teal'},
    ],
    cautionColors: [
      {hex: '#FDE047', nameKey: 'neon_yellow'},
      {hex: '#D6D3D1', nameKey: 'washed_putty'},
      {hex: '#FB7185', nameKey: 'candy_coral'},
    ],
  },
  neutral_high: {
    metalToneKey: 'champagne',
    harmonyAngleDeg: 105,
    chromaSaturationPct: 74,
    valueContrastPct: 86,
    signatureColors: [
      {hex: '#881337', nameKey: 'deep_crimson'},
      {hex: '#0F766E', nameKey: 'deep_teal'},
      {hex: '#1D4ED8', nameKey: 'cobalt_royal'},
      {hex: '#6D28D9', nameKey: 'amethyst_plum'},
      {hex: '#166534', nameKey: 'emerald_pine'},
      {hex: '#B45309', nameKey: 'rich_amber'},
    ],
    baseNeutrals: [
      {hex: '#FFFFFF', nameKey: 'crisp_ivory'},
      {hex: '#9CA3AF', nameKey: 'cool_pewter'},
      {hex: '#27272A', nameKey: 'graphite_ink'},
      {hex: '#111827', nameKey: 'obsidian_navy'},
    ],
    accentColors: [
      {hex: '#D4AF37', nameKey: 'antique_gold'},
      {hex: '#9F1239', nameKey: 'ruby_rose'},
      {hex: '#0D9488', nameKey: 'teal_jewel'},
    ],
    cautionColors: [
      {hex: '#D6C7B2', nameKey: 'pale_khaki'},
      {hex: '#E5E0D8', nameKey: 'faded_oat'},
      {hex: '#A8A29E', nameKey: 'muted_beige'},
    ],
  },
  cool_soft: {
    metalToneKey: 'silver',
    harmonyAngleDeg: 148,
    chromaSaturationPct: 45,
    valueContrastPct: 35,
    signatureColors: [
      {hex: '#6B819E', nameKey: 'periwinkle_slate'},
      {hex: '#A06D82', nameKey: 'rose_mauve'},
      {hex: '#5D8A82', nameKey: 'sea_glass'},
      {hex: '#7A6F8E', nameKey: 'lavender_smoke'},
      {hex: '#4E6B7A', nameKey: 'fjord_blue'},
      {hex: '#B5899A', nameKey: 'soft_berry_quartz'},
    ],
    baseNeutrals: [
      {hex: '#F8FAFC', nameKey: 'porcelain_white'},
      {hex: '#CBD5E1', nameKey: 'mist_grey'},
      {hex: '#64748B', nameKey: 'cool_slate'},
      {hex: '#334155', nameKey: 'soft_navy'},
    ],
    accentColors: [
      {hex: '#94A3B8', nameKey: 'brushed_silver'},
      {hex: '#9D4E6C', nameKey: 'raspberry_soft'},
      {hex: '#2E7A78', nameKey: 'cool_spruce'},
    ],
    cautionColors: [
      {hex: '#EA580C', nameKey: 'burnt_orange'},
      {hex: '#CA8A04', nameKey: 'mustard_yellow'},
      {hex: '#78350F', nameKey: 'rustic_brown'},
    ],
  },
  cool_medium: {
    metalToneKey: 'silver',
    harmonyAngleDeg: 158,
    chromaSaturationPct: 62,
    valueContrastPct: 58,
    signatureColors: [
      {hex: '#9F1239', nameKey: 'cool_cranberry'},
      {hex: '#1E4E79', nameKey: 'sapphire_denim'},
      {hex: '#0F766E', nameKey: 'cool_lagoon'},
      {hex: '#6D3D6E', nameKey: 'plum_orchid'},
      {hex: '#335C67', nameKey: 'nordic_teal'},
      {hex: '#B84A6E', nameKey: 'rose_hibiscus'},
    ],
    baseNeutrals: [
      {hex: '#F8FAFC', nameKey: 'pure_chalk'},
      {hex: '#94A3B8', nameKey: 'pewter_silver'},
      {hex: '#475569', nameKey: 'charcoal_steel'},
      {hex: '#1E293B', nameKey: 'deep_navy'},
    ],
    accentColors: [
      {hex: '#CBD5E1', nameKey: 'platinum_silver'},
      {hex: '#9F1239', nameKey: 'cherry_berry'},
      {hex: '#0E7490', nameKey: 'cerulean_teal'},
    ],
    cautionColors: [
      {hex: '#D97706', nameKey: 'pumpkin_ochre'},
      {hex: '#84CC16', nameKey: 'lime_chartreuse'},
      {hex: '#92400E', nameKey: 'caramel_amber'},
    ],
  },
  cool_high: {
    metalToneKey: 'silver',
    harmonyAngleDeg: 168,
    chromaSaturationPct: 80,
    valueContrastPct: 88,
    signatureColors: [
      {hex: '#9F1239', nameKey: 'crimson_rose'},
      {hex: '#1D4ED8', nameKey: 'cobalt_electric'},
      {hex: '#047857', nameKey: 'emerald_jewel'},
      {hex: '#5B21B6', nameKey: 'royal_violet'},
      {hex: '#0E7490', nameKey: 'cyan_deep'},
      {hex: '#BE185D', nameKey: 'berry_magenta'},
    ],
    baseNeutrals: [
      {hex: '#FFFFFF', nameKey: 'optic_white'},
      {hex: '#94A3B8', nameKey: 'cool_platinum'},
      {hex: '#1E293B', nameKey: 'ink_slate'},
      {hex: '#09090B', nameKey: 'carbon_black'},
    ],
    accentColors: [
      {hex: '#E2E8F0', nameKey: 'mirror_silver'},
      {hex: '#BE123C', nameKey: 'ruby_wine'},
      {hex: '#0F766E', nameKey: 'emerald_teal'},
    ],
    cautionColors: [
      {hex: '#D97706', nameKey: 'golden_ochre'},
      {hex: '#A16207', nameKey: 'camel_mustard'},
      {hex: '#E7D4B5', nameKey: 'warm_beige'},
    ],
  },
};

export function generateAdvisory(calibration: UserCalibration): AdvisoryResult {
  const archetypeKey = `${calibration.temperature}_${calibration.contrast}` as AdvisoryResult['archetypeKey'];
  const spec = PALETTE_SPECS[archetypeKey];

  const outfitTrios = [
    {
      id: 'anchor',
      topHex: spec.baseNeutrals[0].hex,
      bottomHex: spec.baseNeutrals[3].hex,
      accentHex: spec.signatureColors[0].hex,
      topNameKey: spec.baseNeutrals[0].nameKey,
      bottomNameKey: spec.baseNeutrals[3].nameKey,
      accentNameKey: spec.signatureColors[0].nameKey,
    },
    {
      id: 'tonal',
      topHex: spec.signatureColors[1].hex,
      bottomHex: spec.baseNeutrals[2].hex,
      accentHex: spec.accentColors[0].hex,
      topNameKey: spec.signatureColors[1].nameKey,
      bottomNameKey: spec.baseNeutrals[2].nameKey,
      accentNameKey: spec.accentColors[0].nameKey,
    },
    {
      id: 'statement',
      topHex: spec.signatureColors[2].hex,
      bottomHex: spec.baseNeutrals[1].hex,
      accentHex: spec.accentColors[1].hex,
      topNameKey: spec.signatureColors[2].nameKey,
      bottomNameKey: spec.baseNeutrals[1].nameKey,
      accentNameKey: spec.accentColors[1].nameKey,
    },
  ];

  return {
    archetypeKey,
    metalToneKey: spec.metalToneKey,
    signatureColors: spec.signatureColors,
    baseNeutrals: spec.baseNeutrals,
    accentColors: spec.accentColors,
    cautionColors: spec.cautionColors,
    outfitTrios,
    harmonyAngleDeg: spec.harmonyAngleDeg,
    chromaSaturationPct: spec.chromaSaturationPct,
    valueContrastPct: spec.valueContrastPct,
  };
}
