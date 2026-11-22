import type {
  CanvasAnalysisResult,
  ColorSwatch,
  ContrastLevel,
  DemoPresetId,
  Temperature,
} from '../types/stylecue';

function clampByte(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) => clampByte(v).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function relativeLuminance(r: number, g: number, b: number): number {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

interface ColorBucket {
  rSum: number;
  gSum: number;
  bSum: number;
  count: number;
}

/**
 * Performs 100% local in-memory <canvas> color & luminance sampling.
 * Images never leave the browser and object URLs are revoked immediately after drawing.
 */
export async function analyzeImageLocally(file: File): Promise<{
  analysis: CanvasAnalysisResult;
  previewUrl: string;
}> {
  const previewUrl = URL.createObjectURL(file);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Failed to decode image in browser memory.'));
      image.src = previewUrl;
    });

    const maxDim = 144;
    const scale = Math.min(1, maxDim / Math.max(img.naturalWidth || 1, img.naturalHeight || 1));
    const width = Math.max(24, Math.round((img.naturalWidth || maxDim) * scale));
    const height = Math.max(24, Math.round((img.naturalHeight || maxDim) * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', {willReadFrequently: true});
    if (!ctx) {
      throw new Error('2D Canvas context unavailable.');
    }

    ctx.drawImage(img, 0, 0, width, height);
    const {data} = ctx.getImageData(0, 0, width, height);

    const buckets = new Map<string, ColorBucket>();
    const luminances: number[] = [];

    let weightedWarmSum = 0;
    let weightTotal = 0;
    let lumSum = 0;
    let sampledCount = 0;

    // Focus slightly higher weight on central 70% portrait region while keeping full context
    const xMin = Math.floor(width * 0.12);
    const xMax = Math.ceil(width * 0.88);
    const yMin = Math.floor(height * 0.1);
    const yMax = Math.ceil(height * 0.9);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const a = data[idx + 3];
        if (a < 180) continue;

        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        const lum = relativeLuminance(r, g, b);
        luminances.push(lum);
        lumSum += lum;
        sampledCount++;

        const inCenter = x >= xMin && x <= xMax && y >= yMin && y <= yMax;
        const pixelWeight = inCenter ? 2 : 1;

        // Quantize into 24-step color grid (approx 11^3 bins) for deterministic dominant clustering
        const qR = Math.round(r / 24) * 24;
        const qG = Math.round(g / 24) * 24;
        const qB = Math.round(b / 24) * 24;
        const key = `${qR},${qG},${qB}`;

        const bucket = buckets.get(key) ?? {rSum: 0, gSum: 0, bSum: 0, count: 0};
        bucket.rSum += r * pixelWeight;
        bucket.gSum += g * pixelWeight;
        bucket.bSum += b * pixelWeight;
        bucket.count += pixelWeight;
        buckets.set(key, bucket);

        // Chromatic warmth metric on non-clipped midtones
        if (lum > 0.12 && lum < 0.92) {
          const maxC = Math.max(r, g, b);
          const minC = Math.min(r, g, b);
          const chroma = maxC - minC;
          if (chroma > 8) {
            // Warmth bias: red+yellow dominance vs blue dominance
            const warmSignal = ((r - b) * 0.75 + (g - b) * 0.25) / 255;
            weightedWarmSum += warmSignal * pixelWeight;
            weightTotal += pixelWeight;
          }
        }
      }
    }

    if (sampledCount === 0) {
      throw new Error('Image contains no opaque pixels.');
    }

    // Sort buckets by weight and merge overly similar neighbors
    const sortedBuckets = Array.from(buckets.values()).sort((a, b) => b.count - a.count);
    const totalWeight = sortedBuckets.reduce((acc, b) => acc + b.count, 0) || 1;

    const mergedSwatches: ColorSwatch[] = [];
    for (const bucket of sortedBuckets) {
      const r = clampByte(bucket.rSum / bucket.count);
      const g = clampByte(bucket.gSum / bucket.count);
      const b = clampByte(bucket.bSum / bucket.count);

      const isTooClose = mergedSwatches.some((sw) => {
        const dist = Math.hypot(sw.rgb[0] - r, sw.rgb[1] - g, sw.rgb[2] - b);
        return dist < 38;
      });

      if (!isTooClose) {
        mergedSwatches.push({
          hex: rgbToHex(r, g, b),
          rgb: [r, g, b],
          percentage: Math.max(1, Math.round((bucket.count / totalWeight) * 100)),
        });
      }
      if (mergedSwatches.length >= 5) break;
    }

    // Normalize swatch percentages so top 5 sum smoothly for display
    const swatchSum = mergedSwatches.reduce((acc, s) => acc + s.percentage, 0) || 1;
    const normalizedSwatches = mergedSwatches.map((s) => ({
      ...s,
      percentage: Math.max(1, Math.round((s.percentage / swatchSum) * 100)),
    }));

    luminances.sort((a, b) => a - b);
    const p10 = luminances[Math.floor(luminances.length * 0.1)] ?? 0;
    const p90 = luminances[Math.floor(luminances.length * 0.9)] ?? 1;
    const contrastScore = Math.max(5, Math.min(98, Math.round((p90 - p10) * 115)));
    const avgLuminance = Math.max(1, Math.min(99, Math.round((lumSum / sampledCount) * 100)));

    const rawBias = weightTotal > 0 ? (weightedWarmSum / weightTotal) * 140 : 0;
    const thermalBias = Math.max(-100, Math.min(100, Math.round(rawBias)));

    const suggestedTemperature: Temperature =
      thermalBias >= 10 ? 'warm' : thermalBias <= -10 ? 'cool' : 'neutral';

    const suggestedContrast: ContrastLevel =
      contrastScore >= 62 ? 'high' : contrastScore <= 36 ? 'soft' : 'medium';

    return {
      previewUrl,
      analysis: {
        sourceType: 'photo',
        dominantColors: normalizedSwatches,
        avgLuminance,
        contrastScore,
        thermalBias,
        suggestedTemperature,
        suggestedContrast,
        pixelsSampled: sampledCount,
        lightingFlags: {
          warmCast: thermalBias > 48,
          coolCast: thermalBias < -48,
          lowLight: avgLuminance < 26,
          highExposure: avgLuminance > 82,
        },
      },
    };
  } catch (err) {
    URL.revokeObjectURL(previewUrl);
    throw err;
  }
}

export const DEMO_PRESETS: Record<
  DemoPresetId,
  {
    analysis: CanvasAnalysisResult;
    defaults: {
      temperature: Temperature;
      contrast: ContrastLevel;
    };
  }
> = {
  warm_olive: {
    defaults: {temperature: 'warm', contrast: 'medium'},
    analysis: {
      sourceType: 'demo',
      demoPresetId: 'warm_olive',
      dominantColors: [
        {hex: '#C69C72', rgb: [198, 156, 114], percentage: 34},
        {hex: '#5B4332', rgb: [91, 67, 50], percentage: 26},
        {hex: '#7C8568', rgb: [124, 133, 104], percentage: 18},
        {hex: '#EAE1D5', rgb: [234, 225, 213], percentage: 13},
        {hex: '#9A5B43', rgb: [154, 91, 67], percentage: 9},
      ],
      avgLuminance: 54,
      contrastScore: 51,
      thermalBias: 28,
      suggestedTemperature: 'warm',
      suggestedContrast: 'medium',
      pixelsSampled: 20736,
      lightingFlags: {
        warmCast: false,
        coolCast: false,
        lowLight: false,
        highExposure: false,
      },
    },
  },
  cool_porcelain: {
    defaults: {temperature: 'cool', contrast: 'soft'},
    analysis: {
      sourceType: 'demo',
      demoPresetId: 'cool_porcelain',
      dominantColors: [
        {hex: '#E6D6D3', rgb: [230, 214, 211], percentage: 36},
        {hex: '#6B6E7B', rgb: [107, 110, 123], percentage: 24},
        {hex: '#8C9AB0', rgb: [140, 154, 176], percentage: 17},
        {hex: '#B48894', rgb: [180, 136, 148], percentage: 14},
        {hex: '#464954', rgb: [70, 73, 84], percentage: 9},
      ],
      avgLuminance: 68,
      contrastScore: 34,
      thermalBias: -24,
      suggestedTemperature: 'cool',
      suggestedContrast: 'soft',
      pixelsSampled: 20736,
      lightingFlags: {
        warmCast: false,
        coolCast: false,
        lowLight: false,
        highExposure: false,
      },
    },
  },
  deep_contrast: {
    defaults: {temperature: 'neutral', contrast: 'high'},
    analysis: {
      sourceType: 'demo',
      demoPresetId: 'deep_contrast',
      dominantColors: [
        {hex: '#222024', rgb: [34, 32, 36], percentage: 35},
        {hex: '#D7B9A5', rgb: [215, 185, 165], percentage: 25},
        {hex: '#8C243E', rgb: [140, 36, 62], percentage: 16},
        {hex: '#EFECE8', rgb: [239, 236, 232], percentage: 14},
        {hex: '#194E52', rgb: [25, 78, 82], percentage: 10},
      ],
      avgLuminance: 44,
      contrastScore: 78,
      thermalBias: 4,
      suggestedTemperature: 'neutral',
      suggestedContrast: 'high',
      pixelsSampled: 20736,
      lightingFlags: {
        warmCast: false,
        coolCast: false,
        lowLight: false,
        highExposure: false,
      },
    },
  },
};
