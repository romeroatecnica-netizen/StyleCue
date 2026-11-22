import type {TranslationDictionary} from '../i18n/types';
import type {AdvisoryResult, UserCalibration} from '../types/stylecue';

interface HairCroquisProps {
  calibration: UserCalibration;
  t: TranslationDictionary;
}

export function HairCroquisDiagram({calibration, t}: HairCroquisProps) {
  const c = t.results.croquis;

  // Face outline paths calibrated inside a 180x200 viewBox (face centered around x=90, y=96)
  const facePaths: Record<UserCalibration['faceShape'], string> = {
    oval: 'M 60 88 C 60 56, 120 56, 120 88 C 120 124, 106 142, 90 144 C 74 142, 60 124, 60 88 Z',
    round: 'M 57 92 C 57 58, 123 58, 123 92 C 123 125, 108 140, 90 140 C 72 140, 57 125, 57 92 Z',
    square: 'M 59 86 C 59 56, 121 56, 121 86 L 118 124 L 103 141 L 77 141 L 62 124 Z',
    heart: 'M 56 84 C 56 56, 124 56, 124 84 C 121 114, 103 138, 90 144 C 77 138, 59 114, 56 84 Z',
    long: 'M 63 86 C 63 52, 117 52, 117 86 C 117 128, 105 149, 90 151 C 75 149, 63 128, 63 86 Z',
  };

  const hairBottomY =
    calibration.hairLength === 'short' ? 132 : calibration.hairLength === 'medium' ? 162 : 186;

  // Texture strokes on outer hair silhouette
  const renderHairVolume = () => {
    const isCurly = calibration.hairTexture === 'curly' || calibration.hairTexture === 'coily';
    const isWavy = calibration.hairTexture === 'wavy';
    const spread = calibration.hairTexture === 'coily' ? 14 : isCurly ? 10 : isWavy ? 6 : 3;

    if (isCurly) {
      return (
        <path
          d={`M 54 ${hairBottomY} Q 42 ${hairBottomY - 26} 48 ${hairBottomY - 52} Q 40 76 54 58 Q 66 36 90 36 Q 114 36 126 58 Q 140 76 132 ${hairBottomY - 52} Q 138 ${hairBottomY - 26} 126 ${hairBottomY}`}
          fill="#E7E5E4"
          fillOpacity="0.45"
          stroke="#1C1917"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      );
    }

    if (isWavy) {
      return (
        <path
          d={`M ${53 - spread} ${hairBottomY} C ${47 - spread} ${hairBottomY - 25}, 56 105, 50 78 C 47 52, 68 38, 90 38 C 112 38, 133 52, 130 78 C 124 105, ${133 + spread} ${hairBottomY - 25}, ${127 + spread} ${hairBottomY}`}
          fill="#E7E5E4"
          fillOpacity="0.4"
          stroke="#1C1917"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      );
    }

    return (
      <path
        d={`M ${54 - spread} ${hairBottomY} L 52 78 C 52 48, 70 38, 90 38 C 110 38, 128 48, 128 78 L ${126 + spread} ${hairBottomY}`}
        fill="#E7E5E4"
        fillOpacity="0.35"
        stroke="#1C1917"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    );
  };

  const showCrownLift =
    calibration.faceShape === 'round' || calibration.hairTexture === 'straight';
  const showWidthArrows =
    calibration.faceShape === 'long' || calibration.faceShape === 'heart';
  const showJawFraming =
    calibration.faceShape === 'square' || calibration.faceShape === 'heart';

  return (
    <figure className="mb-4 rounded-xl border border-[#E7E5E4] bg-white p-3.5">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <svg
          viewBox="0 0 180 195"
          className="h-40 w-40 shrink-0"
          role="img"
          aria-label={c.hairTitle}
        >
          {/* Hair Silhouette */}
          {renderHairVolume()}

          {/* Neck & Shoulders Hint */}
          <path
            d="M 78 140 L 78 164 M 102 140 L 102 164 M 44 184 Q 70 166 90 166 Q 110 166 136 184"
            fill="none"
            stroke="#A8A29E"
            strokeWidth="1.2"
          />

          {/* Face Contour */}
          <path
            d={facePaths[calibration.faceShape]}
            fill="#FAF9F7"
            stroke="#1C1917"
            strokeWidth="1.5"
          />

          {/* Subtle Facial Feature Marks */}
          <path d="M 72 88 Q 77 85 82 88 M 98 88 Q 103 85 108 88" fill="none" stroke="#78716C" strokeWidth="1.2" />
          <path d="M 88 94 L 87 108 L 92 109" fill="none" stroke="#A8A29E" strokeWidth="1" />
          <path d="M 82 121 Q 90 125 98 121" fill="none" stroke="#78716C" strokeWidth="1.2" />

          {/* Parting Direction Indicator (Off-center diagonal) */}
          <line
            x1="78"
            y1="32"
            x2="86"
            y2="58"
            stroke="#0F766E"
            strokeWidth="1.8"
            strokeDasharray="3 2"
          />
          <circle cx="78" cy="32" r="2.5" fill="#0F766E" />

          {/* Crown Lift Arrow */}
          {showCrownLift && (
            <g stroke="#9F1239" strokeWidth="1.6" fill="none">
              <line x1="90" y1="36" x2="90" y2="16" />
              <polyline points="85,22 90,15 95,22" />
            </g>
          )}

          {/* Cheek / Jaw Framing Curves */}
          {showJawFraming && (
            <g stroke="#9F1239" strokeWidth="1.5" strokeDasharray="3 3" fill="none">
              <path d="M 56 96 Q 58 124 72 138" />
              <path d="M 124 96 Q 122 124 108 138" />
            </g>
          )}

          {/* Width Balance Arrows */}
          {showWidthArrows && (
            <g stroke="#0F766E" strokeWidth="1.5" fill="none">
              <line x1="42" y1="102" x2="26" y2="102" />
              <polyline points="31,98 25,102 31,106" />
              <line x1="138" y1="102" x2="154" y2="102" />
              <polyline points="149,98 155,102 149,106" />
            </g>
          )}
        </svg>

        <figcaption className="space-y-2 text-xs text-[#44403C]">
          <p className="font-display font-semibold text-[#1C1917]">{c.hairTitle}</p>
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#0F766E]" aria-hidden="true" />
              <span>{c.hairSignals.partLine}</span>
            </li>
            {showCrownLift && (
              <li className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#9F1239]" aria-hidden="true" />
                <span>{c.hairSignals.crownLift}</span>
              </li>
            )}
            {showJawFraming && (
              <li className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#9F1239]" aria-hidden="true" />
                <span>{c.hairSignals.jawSoften}</span>
              </li>
            )}
            {showWidthArrows && (
              <li className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#0F766E]" aria-hidden="true" />
                <span>{c.hairSignals.widthBalance}</span>
              </li>
            )}
          </ul>
        </figcaption>
      </div>
    </figure>
  );
}

interface MakeupCroquisProps {
  calibration: UserCalibration;
  advisory: AdvisoryResult;
  t: TranslationDictionary;
}

export function MakeupCroquisDiagram({calibration, advisory, t}: MakeupCroquisProps) {
  const c = t.results.croquis;
  const cheekTint =
    calibration.temperature === 'warm'
      ? '#D47B5B'
      : calibration.temperature === 'cool'
      ? '#B84A6E'
      : '#A8747A';
  const lipTint = advisory.signatureColors[0]?.hex ?? '#9F1239';

  const isSkincareOnly = calibration.makeupLevel === 'none_skincare';
  const isEditorial = calibration.makeupLevel === 'editorial_defined';
  const browStroke = calibration.contrast === 'high' ? 2.4 : calibration.contrast === 'medium' ? 1.8 : 1.3;

  return (
    <figure className="mb-4 rounded-xl border border-[#E7E5E4] bg-white p-3.5">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <svg
          viewBox="0 0 180 195"
          className="h-40 w-40 shrink-0"
          role="img"
          aria-label={c.makeupTitle}
        >
          {/* Face Sketch Base */}
          <path
            d="M 52 84 C 52 44, 128 44, 128 84 C 128 130, 108 154, 90 156 C 72 154, 52 130, 52 84 Z"
            fill="#FAF9F7"
            stroke="#1C1917"
            strokeWidth="1.5"
          />

          {/* Hydration / SPF Shield Arc when skincare-only */}
          {isSkincareOnly && (
            <path
              d="M 44 82 C 44 36, 136 36, 136 82"
              fill="none"
              stroke="#0F766E"
              strokeWidth="1.6"
              strokeDasharray="4 3"
            />
          )}

          {/* Brows calibrated to contrast */}
          <path
            d="M 62 76 Q 73 70 83 75"
            fill="none"
            stroke="#1C1917"
            strokeWidth={browStroke}
            strokeLinecap="round"
          />
          <path
            d="M 97 75 Q 107 70 118 76"
            fill="none"
            stroke="#1C1917"
            strokeWidth={browStroke}
            strokeLinecap="round"
          />

          {/* Eyes & Lash Wing */}
          <path
            d={isEditorial ? 'M 64 87 Q 73 82 82 87 L 85 84' : 'M 65 87 Q 73 83 81 87'}
            fill="none"
            stroke="#1C1917"
            strokeWidth={browStroke * 0.85}
            strokeLinecap="round"
          />
          <path
            d={isEditorial ? 'M 98 87 Q 107 82 116 87 L 119 84' : 'M 99 87 Q 107 83 115 87'}
            fill="none"
            stroke="#1C1917"
            strokeWidth={browStroke * 0.85}
            strokeLinecap="round"
          />

          {/* Nose line */}
          <path d="M 90 86 L 88 106 L 93 108" fill="none" stroke="#A8A29E" strokeWidth="1.1" />

          {/* Cheek Blush / Glow Zone */}
          {!isSkincareOnly ? (
            <g>
              <ellipse
                cx="67"
                cy="106"
                rx={isEditorial ? 11 : 10}
                ry={isEditorial ? 6 : 7}
                transform="rotate(-18 67 106)"
                fill={cheekTint}
                fillOpacity={isEditorial ? 0.55 : 0.35}
              />
              <ellipse
                cx="113"
                cy="106"
                rx={isEditorial ? 11 : 10}
                ry={isEditorial ? 6 : 7}
                transform="rotate(18 113 106)"
                fill={cheekTint}
                fillOpacity={isEditorial ? 0.55 : 0.35}
              />
              {/* Cheek Lift Vector */}
              <line x1="65" y1="108" x2="54" y2="96" stroke="#9F1239" strokeWidth="1.2" strokeDasharray="2 2" />
              <line x1="115" y1="108" x2="126" y2="96" stroke="#9F1239" strokeWidth="1.2" strokeDasharray="2 2" />
            </g>
          ) : (
            <g stroke="#0F766E" strokeWidth="1.3" strokeDasharray="2 2" fill="none">
              <path d="M 60 98 Q 68 94 75 99" />
              <path d="M 105 99 Q 112 94 120 98" />
            </g>
          )}

          {/* Lip Tone Indicator */}
          <path
            d="M 78 125 Q 84 121 90 124 Q 96 121 102 125 Q 90 134 78 125 Z"
            fill={isSkincareOnly ? '#E7E5E4' : lipTint}
            fillOpacity={isSkincareOnly ? 0.7 : isEditorial ? 0.85 : 0.55}
            stroke="#1C1917"
            strokeWidth="1.1"
          />

          {/* High-point glow dot */}
          <circle cx="90" cy="58" r="2.2" fill="#0F766E" />
        </svg>

        <figcaption className="space-y-2 text-xs text-[#44403C]">
          <p className="font-display font-semibold text-[#1C1917]">{c.makeupTitle}</p>
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#0F766E]" aria-hidden="true" />
              <span>{isSkincareOnly ? c.makeupSignals.spfShield : c.makeupSignals.skinGlow}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#1C1917]" aria-hidden="true" />
              <span>{c.makeupSignals.browFrame}</span>
            </li>
            {!isSkincareOnly && (
              <>
                <li className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-black/15"
                    style={{backgroundColor: cheekTint}}
                    aria-hidden="true"
                  />
                  <span>{c.makeupSignals.cheekZone}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-black/15"
                    style={{backgroundColor: lipTint}}
                    aria-hidden="true"
                  />
                  <span>{c.makeupSignals.lipZone}</span>
                </li>
              </>
            )}
          </ul>
        </figcaption>
      </div>
    </figure>
  );
}

interface OutfitCroquisProps {
  calibration: UserCalibration;
  advisory: AdvisoryResult;
  t: TranslationDictionary;
}

export function OutfitCroquisDiagram({calibration, advisory, t}: OutfitCroquisProps) {
  const c = t.results.croquis;
  const trio = advisory.outfitTrios[0];
  const topColor = trio?.topHex ?? '#FAF3E7';
  const bottomColor = trio?.bottomHex ?? '#283137';
  const accentColor = trio?.accentHex ?? '#9F1239';

  const renderNecklinePath = () => {
    switch (calibration.faceShape) {
      case 'round':
        // Deep open V-neck
        return 'M 42 36 L 60 66 L 78 36';
      case 'square':
        // Soft U / scoop neck
        return 'M 42 36 C 42 62, 78 62, 78 36';
      case 'heart':
        // Square / wide neckline
        return 'M 38 38 L 38 54 L 82 54 L 82 38';
      case 'long':
        // Wide horizontal boat neck
        return 'M 34 40 Q 60 46 86 40';
      default:
        // Oval: classic gentle V / clean collar
        return 'M 42 36 Q 60 54 78 36';
    }
  };

  const isVerticalArrow = calibration.faceShape === 'round';
  const isHorizontalArrow = calibration.faceShape === 'long' || calibration.faceShape === 'heart';

  return (
    <figure className="mb-5 rounded-xl border border-[#E7E5E4] bg-white p-4">
      <div className="grid gap-5 md:grid-cols-2 items-center">
        {/* Left Sketch: Recommended Neckline Geometry */}
        <div className="flex items-center gap-4">
          <svg
            viewBox="0 0 120 110"
            className="h-28 w-32 shrink-0 rounded-lg border border-[#E7E5E4] bg-[#FAF9F7]"
            role="img"
            aria-label={c.outfitSignals.necklineGuide}
          >
            {/* Neck & Shoulders Silhouette */}
            <path
              d="M 48 12 L 48 32 L 18 46 L 20 96 L 100 96 L 102 46 L 72 32 L 72 12"
              fill="#FFFFFF"
              stroke="#78716C"
              strokeWidth="1.3"
            />
            {/* Highlighted Neckline Cut */}
            <path
              d={renderNecklinePath()}
              fill="none"
              stroke="#9F1239"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Directional Graphic Signals */}
            {isVerticalArrow && (
              <g stroke="#0F766E" strokeWidth="1.5" fill="none">
                <line x1="60" y1="68" x2="60" y2="88" />
                <polyline points="56,83 60,89 64,83" />
              </g>
            )}
            {isHorizontalArrow && (
              <g stroke="#0F766E" strokeWidth="1.5" fill="none">
                <line x1="36" y1="28" x2="84" y2="28" />
                <polyline points="41,24 35,28 41,32" />
                <polyline points="79,24 85,28 79,32" />
              </g>
            )}
          </svg>
          <div className="space-y-1.5 text-xs text-[#44403C]">
            <p className="font-display font-semibold text-[#1C1917]">
              {c.outfitSignals.necklineGuide}
            </p>
            <p className="text-[11px] leading-relaxed text-[#57534E]">
              {isVerticalArrow
                ? c.outfitSignals.elongateArrow
                : c.outfitSignals.balanceArrow}
            </p>
          </div>
        </div>

        {/* Right Sketch: 1:2 Proportion & 60-30-10 Garment Croquis */}
        <div className="flex items-center gap-4">
          <svg
            viewBox="0 0 130 140"
            className="h-32 w-32 shrink-0 rounded-lg border border-[#E7E5E4] bg-[#FAF9F7]"
            role="img"
            aria-label={c.outfitTitle}
          >
            {/* Head */}
            <circle cx="52" cy="18" r="8" fill="#FAF9F7" stroke="#1C1917" strokeWidth="1.3" />
            {/* Top / Outerwear (60% / 30% zone) */}
            <path
              d="M 35 30 L 69 30 L 76 64 L 68 64 L 65 44 L 65 66 L 39 66 L 39 44 L 36 64 L 28 64 Z"
              fill={topColor}
              stroke="#1C1917"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            {/* Accent Waist / Bag Focal Point (10%) */}
            <rect
              x="39"
              y="62"
              width="26"
              height="5"
              rx="1"
              fill={accentColor}
              stroke="#1C1917"
              strokeWidth="0.9"
            />
            {/* Trousers / Midi Skirt (2/3 vertical length) */}
            <path
              d="M 39 67 L 65 67 L 69 124 L 56 124 L 52 88 L 48 124 L 35 124 Z"
              fill={bottomColor}
              stroke="#1C1917"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            {/* Accent Shoes */}
            <ellipse cx="41" cy="127" rx="5" ry="2.5" fill={accentColor} stroke="#1C1917" strokeWidth="0.9" />
            <ellipse cx="63" cy="127" rx="5" ry="2.5" fill={accentColor} stroke="#1C1917" strokeWidth="0.9" />

            {/* 1 : 2 Vertical Proportion Bracket */}
            <g stroke="#0F766E" strokeWidth="1.4" fill="none">
              <line x1="92" y1="30" x2="98" y2="30" />
              <line x1="98" y1="30" x2="98" y2="66" />
              <line x1="92" y1="66" x2="98" y2="66" />
              <line x1="98" y1="67" x2="98" y2="126" />
              <line x1="92" y1="126" x2="98" y2="126" />
            </g>
            <text x="106" y="51" className="fill-[#0F766E] text-[10px] font-bold">
              1
            </text>
            <text x="106" y="100" className="fill-[#0F766E] text-[10px] font-bold">
              2
            </text>
          </svg>

          <figcaption className="space-y-1.5 text-xs text-[#44403C]">
            <p className="font-display font-semibold text-[#1C1917]">{c.outfitTitle}</p>
            <ul className="space-y-1 text-[11px]">
              <li className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-xs border border-black/20"
                  style={{backgroundColor: topColor}}
                  aria-hidden="true"
                />
                <span>{c.outfitSignals.ratioTop}</span>
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-xs border border-black/20"
                  style={{backgroundColor: bottomColor}}
                  aria-hidden="true"
                />
                <span>{c.outfitSignals.ratioBottom}</span>
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-xs border border-black/20"
                  style={{backgroundColor: accentColor}}
                  aria-hidden="true"
                />
                <span>{c.outfitSignals.focalAccent}</span>
              </li>
            </ul>
          </figcaption>
        </div>
      </div>
    </figure>
  );
}
