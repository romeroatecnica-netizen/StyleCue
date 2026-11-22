import {useRef, useState, type DragEvent, type ChangeEvent} from 'react';
import {Upload, Trash2, RotateCcw, SlidersHorizontal, Eye, AlertTriangle} from 'lucide-react';
import type {TranslationDictionary} from '../i18n/types';
import type {
  CanvasAnalysisResult,
  Climate,
  ContrastLevel,
  DemoPresetId,
  FaceShape,
  HairLength,
  HairTexture,
  MakeupLevel,
  Occasion,
  Temperature,
  UserCalibration,
} from '../types/stylecue';

interface PhotoCalibrationStudioProps {
  previewUrl: string | null;
  analysis: CanvasAnalysisResult | null;
  calibration: UserCalibration;
  isDemoMode: boolean;
  activeDemoPreset: DemoPresetId;
  uploadError: string | null;
  onFileSelected: (file: File) => void;
  onClearPhoto: () => void;
  onSelectDemoPreset: (preset: DemoPresetId) => void;
  onUpdateCalibration: <K extends keyof UserCalibration>(key: K, value: UserCalibration[K]) => void;
  onResetCalibration: () => void;
  t: TranslationDictionary;
}

const DEMO_PRESET_IDS: DemoPresetId[] = ['warm_olive', 'cool_porcelain', 'deep_contrast'];

export function PhotoCalibrationStudio({
  previewUrl,
  analysis,
  calibration,
  isDemoMode,
  activeDemoPreset,
  uploadError,
  onFileSelected,
  onClearPhoto,
  onSelectDemoPreset,
  onUpdateCalibration,
  onResetCalibration,
  t,
}: PhotoCalibrationStudioProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
    e.target.value = '';
  };

  const activeWarnings: string[] = [];
  if (analysis) {
    if (analysis.lightingFlags.warmCast) activeWarnings.push(t.studio.lightingWarnings.warmCast);
    if (analysis.lightingFlags.coolCast) activeWarnings.push(t.studio.lightingWarnings.coolCast);
    if (analysis.lightingFlags.lowLight) activeWarnings.push(t.studio.lightingWarnings.lowLight);
    if (analysis.lightingFlags.highExposure) activeWarnings.push(t.studio.lightingWarnings.highExposure);
  }

  return (
    <section id="studio" className="no-print mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="rounded-2xl border border-[#E7E5E4] bg-white p-5 sm:p-8">
        <div className="flex flex-col gap-1 border-b border-[#E7E5E4] pb-5">
          <h2 className="font-display text-xl font-bold text-[#1C1917] sm:text-2xl">
            {t.studio.sectionTitle}
          </h2>
          <p className="text-sm text-[#57534E]">{t.studio.sectionSubtitle}</p>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Photo Dropzone / Demo Viewer + Local Canvas Telemetry */}
          <div className="space-y-5 lg:col-span-5">
            {/* Local Dropzone or Preview */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded-xl border border-dashed p-5 transition-colors ${
                isDragging
                  ? 'border-[#9F1239] bg-[#9F1239]/5'
                  : 'border-[#D6D3D1] bg-[#FAF9F7]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/*"
                onChange={handleFileChange}
                className="sr-only"
                aria-label={t.studio.chooseFileBtn}
              />

              {previewUrl ? (
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-lg border border-[#E7E5E4] bg-white">
                    <img
                      src={previewUrl}
                      alt={t.studio.canvasSourcePhoto}
                      className="h-56 w-full object-contain bg-[#F5F5F4]"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D6D3D1] bg-white px-3.5 text-xs font-semibold text-[#1C1917] transition-colors hover:bg-[#F5F5F4] cursor-pointer whitespace-nowrap"
                    >
                      <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{t.studio.chooseFileBtn}</span>
                    </button>
                    <button
                      type="button"
                      onClick={onClearPhoto}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#1C1917] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#292524] cursor-pointer whitespace-nowrap"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{t.studio.clearPhotoBtn}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4 text-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E7E5E4] bg-white text-[#9F1239]">
                    <Upload className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[#1C1917]">
                    {t.studio.uploadDropTitle}
                  </p>
                  <p className="mt-1 text-xs text-[#57534E]">{t.studio.uploadDropHint}</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-[#9F1239] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#881337] cursor-pointer whitespace-nowrap"
                  >
                    <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{t.studio.chooseFileBtn}</span>
                  </button>
                </div>
              )}

              {uploadError && (
                <p role="alert" className="mt-3 text-xs font-medium text-[#9F1239]">
                  {uploadError}
                </p>
              )}
            </div>

            {/* Visual Demo Mode Presets */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#44403C]">
                <Eye className="h-3.5 w-3.5 text-[#0F766E]" aria-hidden="true" />
                <span>{t.studio.demoToggleLabel}</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {DEMO_PRESET_IDS.map((presetId) => {
                  const selected = isDemoMode && activeDemoPreset === presetId;
                  const meta = t.studio.demoPresets[presetId];
                  return (
                    <button
                      key={presetId}
                      type="button"
                      onClick={() => onSelectDemoPreset(presetId)}
                      className={`rounded-lg border p-2.5 text-start transition-colors cursor-pointer ${
                        selected
                          ? 'border-[#0F766E] bg-[#0F766E]/8 text-[#1C1917]'
                          : 'border-[#E7E5E4] bg-[#FAF9F7] text-[#44403C] hover:border-[#D6D3D1]'
                      }`}
                    >
                      <span className="block text-xs font-semibold">{meta.label}</span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-[#57534E]">
                        {meta.note}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Local Canvas Telemetry Readout */}
            <div className="rounded-xl border border-[#E7E5E4] bg-[#FAF9F7] p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-xs font-semibold text-[#1C1917]">
                  {t.studio.canvasHeading}
                </h3>
                {analysis && (
                  <span className="text-[11px] font-medium text-[#0F766E]">
                    {analysis.sourceType === 'photo'
                      ? t.studio.canvasSourcePhoto
                      : t.studio.canvasSourceDemo}
                  </span>
                )}
              </div>

              {analysis ? (
                <div className="mt-3 space-y-4">
                  {/* Dominant Swatches */}
                  <div>
                    <p className="text-[11px] font-medium text-[#57534E]">
                      {t.studio.dominantSwatchesTitle}
                    </p>
                    <div className="mt-2 grid grid-cols-5 gap-2">
                      {analysis.dominantColors.map((sw, idx) => (
                        <div key={`${sw.hex}-${idx}`} className="space-y-1">
                          <div
                            className="h-9 w-full rounded-md border border-black/10"
                            style={{backgroundColor: sw.hex}}
                            title={`${sw.hex} · rgb(${sw.rgb.join(', ')})`}
                          />
                          <div className="font-mono-tabular text-[10px] leading-tight text-[#44403C]">
                            <div className="truncate font-medium">{sw.hex}</div>
                            <div className="text-[#78716C]">{sw.percentage}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quantitative Canvas Metrics */}
                  <div className="grid grid-cols-2 gap-2.5 border-t border-[#E7E5E4] pt-3 sm:grid-cols-4 lg:grid-cols-2">
                    <div>
                      <span className="block text-[11px] text-[#57534E]">
                        {t.studio.metricLuminance}
                      </span>
                      <span className="font-mono-tabular text-sm font-semibold text-[#1C1917]">
                        {analysis.avgLuminance}%
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-[#57534E]">
                        {t.studio.metricContrast}
                      </span>
                      <span className="font-mono-tabular text-sm font-semibold text-[#1C1917]">
                        {analysis.contrastScore}%
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-[#57534E]">
                        {t.studio.metricThermalBias}
                      </span>
                      <span className="font-mono-tabular text-sm font-semibold text-[#1C1917]">
                        {analysis.thermalBias > 0 ? `+${analysis.thermalBias}` : analysis.thermalBias}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-[#57534E]">
                        {t.studio.metricPixels}
                      </span>
                      <span className="font-mono-tabular text-sm font-semibold text-[#1C1917]">
                        {analysis.pixelsSampled.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {activeWarnings.length > 0 && (
                    <div className="space-y-1 border-t border-[#E7E5E4] pt-3 text-[11px] leading-relaxed text-[#9F1239]">
                      {activeWarnings.map((warn, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span>{warn}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-2 text-xs text-[#57534E]">{t.studio.canvasEmpty}</p>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Manual Calibration Controls */}
          <div className="space-y-5 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#9F1239]" aria-hidden="true" />
                <h3 className="font-display text-base font-semibold text-[#1C1917]">
                  {t.studio.controlsTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={onResetCalibration}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E7E5E4] bg-[#FAF9F7] px-3 text-xs font-medium text-[#44403C] transition-colors hover:bg-[#F5F5F4] cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t.studio.resetCalibration}</span>
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Perceived Temperature */}
              <SegmentedGroup<Temperature>
                label={t.studio.labels.temperature}
                value={calibration.temperature}
                options={(['warm', 'neutral', 'cool'] as Temperature[]).map((val) => ({
                  value: val,
                  label: t.studio.options.temperature[val],
                }))}
                onChange={(val) => onUpdateCalibration('temperature', val)}
              />

              {/* Value Contrast */}
              <SegmentedGroup<ContrastLevel>
                label={t.studio.labels.contrast}
                value={calibration.contrast}
                options={(['soft', 'medium', 'high'] as ContrastLevel[]).map((val) => ({
                  value: val,
                  label: t.studio.options.contrast[val],
                }))}
                onChange={(val) => onUpdateCalibration('contrast', val)}
              />

              {/* Occasion */}
              <SegmentedGroup<Occasion>
                label={t.studio.labels.occasion}
                value={calibration.occasion}
                options={(['casual', 'office', 'evening'] as Occasion[]).map((val) => ({
                  value: val,
                  label: t.studio.options.occasion[val],
                }))}
                onChange={(val) => onUpdateCalibration('occasion', val)}
              />

              {/* Climate */}
              <SegmentedGroup<Climate>
                label={t.studio.labels.climate}
                value={calibration.climate}
                options={(['warm', 'mild', 'cold'] as Climate[]).map((val) => ({
                  value: val,
                  label: t.studio.options.climate[val],
                }))}
                onChange={(val) => onUpdateCalibration('climate', val)}
              />

              {/* Face Silhouette */}
              <SelectField<FaceShape>
                label={t.studio.labels.faceShape}
                value={calibration.faceShape}
                options={(['oval', 'round', 'square', 'heart', 'long'] as FaceShape[]).map((val) => ({
                  value: val,
                  label: t.studio.options.faceShape[val],
                }))}
                onChange={(val) => onUpdateCalibration('faceShape', val)}
              />

              {/* Makeup / Skin Finish */}
              <SelectField<MakeupLevel>
                label={t.studio.labels.makeupLevel}
                value={calibration.makeupLevel}
                options={(
                  ['none_skincare', 'daily_luminous', 'editorial_defined'] as MakeupLevel[]
                ).map((val) => ({
                  value: val,
                  label: t.studio.options.makeupLevel[val],
                }))}
                onChange={(val) => onUpdateCalibration('makeupLevel', val)}
              />

              {/* Hair Length */}
              <SegmentedGroup<HairLength>
                label={t.studio.labels.hairLength}
                value={calibration.hairLength}
                options={(['short', 'medium', 'long'] as HairLength[]).map((val) => ({
                  value: val,
                  label: t.studio.options.hairLength[val],
                }))}
                onChange={(val) => onUpdateCalibration('hairLength', val)}
              />

              {/* Hair Texture */}
              <SelectField<HairTexture>
                label={t.studio.labels.hairTexture}
                value={calibration.hairTexture}
                options={(['straight', 'wavy', 'curly', 'coily'] as HairTexture[]).map((val) => ({
                  value: val,
                  label: t.studio.options.hairTexture[val],
                }))}
                onChange={(val) => onUpdateCalibration('hairTexture', val)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface OptionItem<T extends string> {
  value: T;
  label: string;
}

function SegmentedGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: OptionItem<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="space-y-1.5">
      <span className="block text-xs font-semibold text-[#44403C]">{label}</span>
      <div className="grid grid-cols-3 gap-1 rounded-lg border border-[#E7E5E4] bg-[#FAF9F7] p-1">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={active}
              className={`min-h-[36px] rounded-md px-2 py-1.5 text-xs font-medium transition-colors cursor-pointer truncate ${
                active
                  ? 'bg-white text-[#9F1239] shadow-xs font-semibold'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
              title={opt.label}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: OptionItem<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-xs font-semibold text-[#44403C]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-11 w-full rounded-lg border border-[#E7E5E4] bg-[#FAF9F7] px-3 text-xs font-medium text-[#1C1917] transition-colors hover:border-[#D6D3D1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9F1239] cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
