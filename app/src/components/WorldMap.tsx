import { useEffect, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  countryName,
  loadWorldMapGeometry,
  tierFor,
  type WorldMapGeometry,
} from '@/utils/communityDirectory';

type Tier = 1 | 2 | 3 | 4;

const TIER_FILL: Record<Tier, string> = {
  1: 'fill-emerald-200 dark:fill-emerald-700',
  2: 'fill-emerald-400 dark:fill-emerald-500',
  3: 'fill-emerald-600 dark:fill-emerald-300',
  4: 'fill-emerald-800 dark:fill-emerald-200',
};

const TIER_SWATCH: Record<Tier, string> = {
  1: 'bg-emerald-200 dark:bg-emerald-700',
  2: 'bg-emerald-400 dark:bg-emerald-500',
  3: 'bg-emerald-600 dark:bg-emerald-300',
  4: 'bg-emerald-800 dark:bg-emerald-200',
};

// Literal keys so the i18n checker can see them.
const TIER_LEGEND: { tier: Tier; labelKey: string }[] = [
  { tier: 1, labelKey: 'directory.map.tier1' },
  { tier: 2, labelKey: 'directory.map.tier2' },
  { tier: 3, labelKey: 'directory.map.tier3' },
  { tier: 4, labelKey: 'directory.map.tier4' },
];

const LABEL_HEIGHT = 22;
const LABEL_EDGE = 4;

interface WorldMapProps {
  counts: Record<string, number>;
  selected: string | null;
  onSelect: (code: string | null) => void;
}

export default function WorldMap({ counts, selected, onSelect }: WorldMapProps) {
  const { t, i18n } = useTranslation();
  const [geometry, setGeometry] = useState<WorldMapGeometry | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    loadWorldMapGeometry()
      .then((geo) => {
        if (active) setGeometry(geo);
      })
      .catch(() => undefined); // The page shows the load error itself.
    return () => {
      active = false;
    };
  }, []);

  if (!geometry) {
    return <div className="w-full rounded-md bg-muted" style={{ aspectRatio: '960 / 500' }} aria-hidden="true" />;
  }

  const lang = i18n.language;
  const { width, height, countries } = geometry;
  const codes = Object.keys(countries);
  const coloredCodes = codes.filter((code) => counts[code] > 0);
  const plainCodes = codes.filter((code) => !counts[code]);

  const toggle = (code: string) => onSelect(selected === code ? null : code);

  const handleKeyDown = (event: KeyboardEvent<SVGGElement>, code: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle(code);
    }
  };

  // Labels for hovered, focused or selected countries, drawn last so they sit on top.
  const labelCodes = [...new Set([hovered, focused, selected])].filter(
    (code): code is string => Boolean(code) && counts[code as string] > 0 && Boolean(countries[code as string]),
  );

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="group"
        aria-label={t('directory.map.label')}
      >
        {plainCodes.map((code) => (
          <path
            key={code}
            d={countries[code].d}
            className="fill-muted stroke-border"
            strokeWidth={0.5}
            aria-hidden="true"
          />
        ))}

        {coloredCodes.map((code) => {
          const count = counts[code];
          const isSelected = selected === code;
          const name = countryName(code, lang);
          const text = `${name}: ${t('directory.networkCount', { count })}`;
          const fill = isSelected ? 'fill-amber-500' : TIER_FILL[tierFor(count)];
          const strokeWidth = isSelected || focused === code ? 2 : 0.5;
          const point = countries[code];
          const radius = count >= 100 ? 9 : 7;
          return (
            <g
              key={code}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={text}
              className="group outline-none cursor-pointer"
              onClick={() => toggle(code)}
              onKeyDown={(event) => handleKeyDown(event, code)}
              onMouseEnter={() => setHovered(code)}
              onMouseLeave={() => setHovered((current) => (current === code ? null : current))}
              onFocus={() => setFocused(code)}
              onBlur={() => setFocused((current) => (current === code ? null : current))}
            >
              <title>{text}</title>
              <path
                d={countries[code].d}
                className={`${fill} stroke-background transition-opacity group-hover:opacity-80`}
                strokeWidth={strokeWidth}
              />
              {/* Invisible, larger hit area so tiny islands are easy to tap. */}
              <circle cx={point.x} cy={point.y} r={12} fill="transparent" />
              <circle
                cx={point.x}
                cy={point.y}
                r={radius}
                className="fill-background stroke-emerald-700 transition-opacity group-hover:opacity-80"
                strokeWidth={1}
              />
              <text
                x={point.x}
                y={point.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-foreground text-[8px] font-semibold pointer-events-none"
              >
                {count}
              </text>
            </g>
          );
        })}

        {labelCodes.map((code) => {
          const point = countries[code];
          const count = counts[code];
          const text = `${countryName(code, lang)} · ${count}`;
          const labelWidth = text.length * 6 + 24;
          const x = Math.max(LABEL_EDGE, Math.min(point.x - labelWidth / 2, width - labelWidth - LABEL_EDGE));
          const y = Math.max(LABEL_EDGE, point.y - 34);
          return (
            <g key={`label-${code}`} aria-hidden="true" className="pointer-events-none">
              <rect
                x={x}
                y={y}
                width={labelWidth}
                height={LABEL_HEIGHT}
                rx={6}
                className="fill-background stroke-border"
                strokeWidth={1}
              />
              <text
                x={x + labelWidth / 2}
                y={y + LABEL_HEIGHT / 2}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-foreground text-[10px] font-medium"
              >
                {text}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{t('directory.map.legendTitle')}</span>
        {TIER_LEGEND.map(({ tier, labelKey }) => (
          <span key={tier} className="flex items-center gap-2">
            <span className={`inline-block h-3 w-3 rounded-sm ${TIER_SWATCH[tier]}`} aria-hidden="true" />
            {t(labelKey)}
          </span>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{t('directory.map.smallIslandsNote')}</p>
    </div>
  );
}
