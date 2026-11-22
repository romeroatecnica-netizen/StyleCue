import type {TranslationDictionary} from '../i18n/types';
import type {AdvisoryResult, UserCalibration} from '../types/stylecue';

interface ColorHarmonyDiagramProps {
  advisory: AdvisoryResult;
  calibration: UserCalibration;
  t: TranslationDictionary;
}

export function ColorHarmonyDiagram({advisory, calibration, t}: ColorHarmonyDiagramProps) {
  const d = t.results.palettePillar.diagram;
  const cx = 130;
  const cy = 122;
  const radius = 84;

  // Map harmonyAngleDeg (20..170) across the semi-circular thermal arc (180deg warm left to 0deg cool right)
  const rad = ((180 - advisory.harmonyAngleDeg) * Math.PI) / 180;
  const markerX = cx + Math.cos(rad) * radius;
  const markerY = cy - Math.sin(rad) * radius;

  const primarySignature = advisory.signatureColors[0]?.hex ?? '#9F1239';
  const primaryNeutral = advisory.baseNeutrals[3]?.hex ?? '#1C1917';
  const primaryAccent = advisory.accentColors[0]?.hex ?? '#0F766E';

  return (
    <div className="rounded-xl border border-[#E7E5E4] bg-[#FAF9F7] p-5 print-break-inside-avoid">
      <div className="flex flex-col gap-1">
        <h4 className="font-display text-sm font-semibold text-[#1C1917]">{d.title}</h4>
        <p className="text-xs text-[#57534E]">{d.subtitle}</p>
      </div>

      <div className="mt-4 grid items-center gap-6 md:grid-cols-2">
        {/* SVG Thermal & Contrast Arc */}
        <div className="flex flex-col items-center">
          <svg
            viewBox="0 0 260 155"
            className="w-full max-w-[260px]"
            role="img"
            aria-label={`${d.title}: ${t.results.archetypes[advisory.archetypeKey].name}`}
          >
            <defs>
              <linearGradient id="thermalArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B45309" />
                <stop offset="50%" stopColor="#78716C" />
                <stop offset="100%" stopColor="#0F766E" />
              </linearGradient>
            </defs>

            {/* Outer Subtle Track */}
            <path
              d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
              fill="none"
              stroke="#E7E5E4"
              strokeWidth="16"
              strokeLinecap="round"
            />
            {/* Colored Thermal Gradient Arc */}
            <path
              d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
              fill="none"
              stroke="url(#thermalArcGrad)"
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.88"
            />

            {/* Neutral Center Tick */}
            <line
              x1={cx}
              y1={cy - radius - 10}
              x2={cx}
              y2={cy - radius + 10}
              stroke="#57534E"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />

            {/* Pole Labels */}
            <text x={cx - radius} y={cy + 20} textAnchor="middle" className="fill-[#78716C] text-[10px] font-medium">
              {d.warmPole}
            </text>
            <text x={cx} y={cy - radius - 15} textAnchor="middle" className="fill-[#78716C] text-[10px] font-medium">
              {d.neutralZone}
            </text>
            <text x={cx + radius} y={cy + 20} textAnchor="middle" className="fill-[#78716C] text-[10px] font-medium">
              {d.coolPole}
            </text>

            {/* Radial pointer line */}
            <line
              x1={cx}
              y1={cy}
              x2={markerX}
              y2={markerY}
              stroke="#1C1917"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <circle cx={cx} cy={cy} r="4" fill="#1C1917" />

            {/* Active Tone Marker */}
            <circle
              cx={markerX}
              cy={markerY}
              r="9"
              fill={primarySignature}
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />

            {/* Center Readout */}
            <text x={cx} y={cy - 18} textAnchor="middle" className="fill-[#1C1917] text-[11px] font-semibold">
              {t.studio.options.temperature[calibration.temperature]} · {t.studio.options.contrast[calibration.contrast]}
            </text>
          </svg>
        </div>

        {/* Contrast / Chroma Bars & 60-30-10 Proportion Strip */}
        <div className="space-y-4">
          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-xs font-medium text-[#44403C]">
                <span>{d.chromaLabel}</span>
                <span className="font-mono-tabular">{advisory.chromaSaturationPct}%</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#E7E5E4]">
                <div
                  className="h-full rounded-full bg-[#0F766E] transition-all duration-200"
                  style={{width: `${advisory.chromaSaturationPct}%`}}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-[#44403C]">
                <span>{d.contrastLabel}</span>
                <span className="font-mono-tabular">{advisory.valueContrastPct}%</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#E7E5E4]">
                <div
                  className="h-full rounded-full bg-[#9F1239] transition-all duration-200"
                  style={{width: `${advisory.valueContrastPct}%`}}
                />
              </div>
            </div>
          </div>

          <div className="pt-1">
            <p className="text-xs font-semibold text-[#1C1917]">{d.proportionTitle}</p>
            <div className="mt-2 flex h-7 w-full overflow-hidden rounded-lg border border-[#E7E5E4]">
              <div
                className="flex items-center justify-center text-[11px] font-semibold text-white tabular-nums"
                style={{width: '60%', backgroundColor: primaryNeutral}}
                title={d.proportion60}
              >
                60%
              </div>
              <div
                className="flex items-center justify-center text-[11px] font-semibold text-white tabular-nums"
                style={{width: '30%', backgroundColor: primarySignature}}
                title={d.proportion30}
              >
                30%
              </div>
              <div
                className="flex items-center justify-center text-[11px] font-semibold text-white tabular-nums"
                style={{width: '10%', backgroundColor: primaryAccent}}
                title={d.proportion10}
              >
                10%
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#57534E]">
              <span>{d.proportion60}</span>
              <span aria-hidden="true">·</span>
              <span>{d.proportion30}</span>
              <span aria-hidden="true">·</span>
              <span>{d.proportion10}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
