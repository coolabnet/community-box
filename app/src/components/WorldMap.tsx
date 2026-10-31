import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  countryName,
  loadWorldMapGeometry,
  tierFor,
  type WorldMapCountry,
  type WorldMapGeometry,
} from '@/utils/communityDirectory';
import {
  MAX_ZOOM,
  bubbleRadius,
  clientToMap,
  easeInOutCubic,
  fitBox,
  interpolateViewBox,
  panBy,
  pathBounds,
  pixelsPerUnit,
  worldViewBox,
  zoomAt,
  type MapBounds,
  type ViewBox,
} from '@/utils/mapZoom';

type Tier = 1 | 2 | 3 | 4;

const TIER_FILL: Record<Tier, string> = {
  1: 'fill-emerald-200 dark:fill-emerald-800',
  2: 'fill-emerald-400 dark:fill-emerald-600',
  3: 'fill-emerald-600 dark:fill-emerald-400',
  4: 'fill-emerald-800 dark:fill-emerald-200',
};

const TIER_SWATCH: Record<Tier, string> = {
  1: 'bg-emerald-200 dark:bg-emerald-800',
  2: 'bg-emerald-400 dark:bg-emerald-600',
  3: 'bg-emerald-600 dark:bg-emerald-400',
  4: 'bg-emerald-800 dark:bg-emerald-200',
};

// Literal keys so the i18n checker can see them.
const TIER_LEGEND: { tier: Tier; labelKey: string }[] = [
  { tier: 1, labelKey: 'directory.map.tier1' },
  { tier: 2, labelKey: 'directory.map.tier2' },
  { tier: 3, labelKey: 'directory.map.tier3' },
  { tier: 4, labelKey: 'directory.map.tier4' },
];

const DEFAULT_BOUNDS: MapBounds = { width: 960, height: 500 };
const ANIMATION_MS = 450;
const DRAG_THRESHOLD = 4;
const DENSE_LABEL_ZOOM = 3;
const PILL_HEIGHT = 26;
const SHADOW_ID = 'community-map-shadow';

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function roundAspect(width: number, height: number): number {
  if (!width || !height) return DEFAULT_BOUNDS.width / DEFAULT_BOUNDS.height;
  return Math.round((width / height) * 100) / 100;
}

// Faint latitude / longitude lines, straight in the projected space.
function graticulePath({ width, height }: MapBounds): string {
  const parts: string[] = [];
  for (let i = 1; i < 6; i += 1) parts.push(`M0,${(height * i) / 6}H${width}`);
  for (let i = 1; i < 12; i += 1) parts.push(`M${(width * i) / 12},0V${height}`);
  return parts.join('');
}

function countryView(country: WorldMapCountry, bounds: MapBounds, aspect: number): ViewBox {
  const box = pathBounds(country.d, country) ?? { x: country.x - 30, y: country.y - 20, width: 60, height: 40 };
  // Make sure the bubble itself is in view.
  const minX = Math.min(box.x, country.x);
  const minY = Math.min(box.y, country.y);
  const maxX = Math.max(box.x + box.width, country.x);
  const maxY = Math.max(box.y + box.height, country.y);
  // Tiny islands stop at about 8x.
  return fitBox({ x: minX, y: minY, width: maxX - minX, height: maxY - minY }, aspect, bounds.width / 8, bounds);
}

interface LandLayerProps {
  countries: Record<string, WorldMapCountry>;
  counts: Record<string, number>;
  selected: string | null;
  hovered: string | null;
  onHover: (code: string | null) => void;
}

// Country shapes. Memoized so pan / zoom frames do not re-render ~240 paths.
const LandLayer = memo(function LandLayer({ countries, counts, selected, hovered, onHover }: LandLayerProps) {
  return (
    <g aria-hidden="true">
      {Object.keys(countries).map((code) => {
        const count = counts[code] ?? 0;
        if (!count) {
          return (
            <path
              key={code}
              data-code={code}
              d={countries[code].d}
              className="fill-slate-200 stroke-white dark:fill-slate-700 dark:stroke-slate-900"
              strokeWidth={0.6}
              vectorEffect="non-scaling-stroke"
            />
          );
        }
        const isSelected = selected === code;
        const isHot = hovered === code;
        let className = `${TIER_FILL[tierFor(count)]} stroke-white dark:stroke-slate-900`;
        if (isSelected) className = 'fill-amber-400 stroke-amber-700 dark:fill-amber-500 dark:stroke-amber-200';
        else if (isHot) className = `${TIER_FILL[tierFor(count)]} brightness-110 stroke-emerald-900 dark:stroke-emerald-100`;
        return (
          <path
            key={code}
            data-code={code}
            d={countries[code].d}
            className={`${className} cursor-pointer transition-[fill,filter] duration-150`}
            strokeWidth={isSelected || isHot ? 1.5 : 0.6}
            vectorEffect="non-scaling-stroke"
            onPointerEnter={() => onHover(code)}
            onPointerLeave={() => onHover(null)}
          />
        );
      })}
    </g>
  );
});

interface BubbleVisualProps {
  count: number;
  isSelected: boolean;
  isHot: boolean;
  isFocused: boolean;
}

function BubbleVisual({ count, isSelected, isHot, isFocused }: BubbleVisualProps) {
  const r = bubbleRadius(count);
  const fontSize = r >= 15 ? 11 : 10;
  return (
    <g
      className="transition-transform duration-150 motion-reduce:transition-none"
      style={{
        transformBox: 'fill-box',
        transformOrigin: 'center',
        transform: isHot || isSelected ? 'scale(1.15)' : undefined,
      }}
    >
      <circle cy={1.5} r={r} className="fill-slate-900/25 dark:fill-black/50" />
      <circle
        r={r}
        className={
          isSelected
            ? 'fill-amber-700 stroke-white'
            : isHot
              ? 'fill-white stroke-emerald-700 dark:fill-slate-900 dark:stroke-emerald-300'
              : 'fill-white stroke-emerald-600 dark:fill-slate-900 dark:stroke-emerald-400'
        }
        strokeWidth={isSelected || isHot ? 2.5 : 1.5}
        vectorEffect="non-scaling-stroke"
      />
      {isFocused && (
        <circle
          r={r + 4}
          className="fill-none stroke-sky-600 dark:stroke-sky-300"
          strokeWidth={2.5}
          vectorEffect="non-scaling-stroke"
        />
      )}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSize}
        className={`font-bold pointer-events-none ${
          isSelected ? 'fill-white' : 'fill-emerald-900 dark:fill-emerald-100'
        }`}
      >
        {count}
      </text>
    </g>
  );
}

interface WorldMapProps {
  counts: Record<string, number>;
  selected: string | null;
  onSelect: (code: string | null) => void;
}

export default function WorldMap({ counts, selected, onSelect }: WorldMapProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [geometry, setGeometry] = useState<WorldMapGeometry | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [view, setView] = useState<ViewBox>(() =>
    worldViewBox(DEFAULT_BOUNDS, DEFAULT_BOUNDS.width / DEFAULT_BOUNDS.height),
  );
  const [dragging, setDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const viewRef = useRef<ViewBox>(view);
  const targetRef = useRef<ViewBox>(view);
  const frameRef = useRef(0);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const gestureRef = useRef({ startX: 0, startY: 0, moved: false, lastDistance: 0, lastMidX: 0, lastMidY: 0 });
  const draggedRef = useRef(false);

  const bounds = useMemo<MapBounds>(
    () => (geometry ? { width: geometry.width, height: geometry.height } : DEFAULT_BOUNDS),
    [geometry],
  );
  const aspect = roundAspect(size.width, size.height);

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

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((current) => (current.width === width && current.height === height ? current : { width, height }));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const applyView = useCallback((next: ViewBox) => {
    viewRef.current = next;
    setView(next);
  }, []);

  const cancelAnimation = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
  }, []);

  const animateTo = useCallback(
    (target: ViewBox) => {
      cancelAnimation();
      targetRef.current = target;
      const from = viewRef.current;
      if (prefersReducedMotion()) {
        frameRef.current = requestAnimationFrame(() => {
          frameRef.current = 0;
          applyView(target);
        });
        return;
      }
      let start = 0;
      const step = (now: number) => {
        if (!start) start = now;
        const progress = Math.min(1, (now - start) / ANIMATION_MS);
        applyView(interpolateViewBox(from, target, easeInOutCubic(progress)));
        frameRef.current = progress < 1 ? requestAnimationFrame(step) : 0;
      };
      frameRef.current = requestAnimationFrame(step);
    },
    [applyView, cancelAnimation],
  );

  useEffect(() => cancelAnimation, [cancelAnimation]);

  // Zoom to the selected country, or back out to the world when it is cleared.
  useEffect(() => {
    if (!geometry) return;
    const country = selected ? geometry.countries[selected] : undefined;
    animateTo(country ? countryView(country, bounds, aspect) : worldViewBox(bounds, aspect));
  }, [geometry, selected, bounds, aspect, animateTo]);

  // Wheel zoom around the cursor. Native listener so the page does not scroll
  // while the pointer is over the map (React wheel listeners are passive).
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      cancelAnimation();
      const rect = svg.getBoundingClientRect();
      const current = viewRef.current;
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      const factor = Math.exp(-delta * 0.002);
      const point = clientToMap(current, rect.width, rect.height, {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
      const next = zoomAt(current, factor, point, bounds, roundAspect(rect.width, rect.height));
      targetRef.current = next;
      applyView(next);
    };
    svg.addEventListener('wheel', handleWheel, { passive: false });
    return () => svg.removeEventListener('wheel', handleWheel);
  }, [geometry, bounds, applyView, cancelAnimation]);

  const handleHover = useCallback((code: string | null) => setHovered(code), []);

  const showWorld = () => {
    if (selected) onSelect(null);
    else animateTo(worldViewBox(bounds, aspect));
  };

  const toggle = (code: string) => onSelect(selected === code ? null : code);

  const zoomBy = (factor: number) => {
    const target = targetRef.current;
    animateTo(zoomAt(target, factor, { x: target.x + target.w / 2, y: target.y + target.h / 2 }, bounds, aspect));
  };

  const handlePointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointersRef.current.size === 1) {
      gestureRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
        lastDistance: 0,
        lastMidX: 0,
        lastMidY: 0,
      };
      draggedRef.current = false;
    }
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const pointers = pointersRef.current;
    const previous = pointers.get(event.pointerId);
    if (!previous) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const gesture = gestureRef.current;
    const current = viewRef.current;
    const currentAspect = roundAspect(rect.width, rect.height);
    const ppu = pixelsPerUnit(current, rect.width, rect.height);

    if (pointers.size >= 2) {
      const [a, b] = [...pointers.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      if (gesture.lastDistance > 0) {
        cancelAnimation();
        const point = clientToMap(current, rect.width, rect.height, { x: midX - rect.left, y: midY - rect.top });
        const zoomed = zoomAt(current, distance / gesture.lastDistance, point, bounds, currentAspect);
        const zoomedPpu = pixelsPerUnit(zoomed, rect.width, rect.height);
        const next = panBy(
          zoomed,
          -(midX - gesture.lastMidX) / zoomedPpu,
          -(midY - gesture.lastMidY) / zoomedPpu,
          bounds,
          currentAspect,
        );
        targetRef.current = next;
        applyView(next);
      }
      gesture.moved = true;
      draggedRef.current = true;
      gesture.lastDistance = distance;
      gesture.lastMidX = midX;
      gesture.lastMidY = midY;
      return;
    }

    if (!gesture.moved) {
      if (Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY) < DRAG_THRESHOLD) return;
      gesture.moved = true;
      draggedRef.current = true;
      setDragging(true);
      cancelAnimation();
      try {
        svg.setPointerCapture(event.pointerId);
      } catch {
        // Capture is a nicety; panning still works without it.
      }
    }
    const next = panBy(
      current,
      -(event.clientX - previous.x) / ppu,
      -(event.clientY - previous.y) / ppu,
      bounds,
      currentAspect,
    );
    targetRef.current = next;
    applyView(next);
  };

  const handlePointerEnd = (event: PointerEvent<SVGSVGElement>) => {
    pointersRef.current.delete(event.pointerId);
    if (pointersRef.current.size < 2) gestureRef.current.lastDistance = 0;
    if (pointersRef.current.size === 0) setDragging(false);
  };

  const handleClick = (event: MouseEvent<SVGSVGElement>) => {
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }
    if (event.detail > 1) return; // The second click of a double-click only zooms.
    const target = (event.target as Element).closest('[data-code]');
    const code = target?.getAttribute('data-code');
    if (code && counts[code] > 0) toggle(code);
    else showWorld();
  };

  const handleDoubleClick = (event: MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const target = targetRef.current;
    const point = clientToMap(viewRef.current, rect.width, rect.height, {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
    animateTo(zoomAt(target, 2, point, bounds, aspect));
  };

  const handleBubbleKeyDown = (event: KeyboardEvent<SVGGElement>, code: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle(code);
    }
  };

  const handleMapKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      showWorld();
    }
  };

  // Compact so it stays clear of the Pacific island bubbles in the world view.
  const legend = (
    <div className="rounded-xl border bg-background/85 px-3 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-semibold text-foreground">{t('directory.map.legendTitle')}</span>
        {TIER_LEGEND.map(({ tier, labelKey }) => (
          <span key={tier} className="flex items-center gap-1">
            <span className={`inline-block h-2.5 w-2.5 rounded-sm ${TIER_SWATCH[tier]}`} aria-hidden="true" />
            {t(labelKey)}
          </span>
        ))}
      </div>
      <p className="mt-1.5 flex items-center gap-1.5">
        <span
          className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] border-emerald-600 bg-white text-[9px] font-bold text-emerald-900 dark:border-emerald-400 dark:bg-slate-900 dark:text-emerald-100"
          aria-hidden="true"
        >
          3
        </span>
        {t('directory.map.bubbleLegend')}
      </p>
    </div>
  );

  const hint = (
    <p className="rounded-full border bg-background/85 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur-sm">
      {t('directory.map.hint')}
    </p>
  );

  const k = bounds.width / view.w;
  const controls = [
    { key: 'in', label: t('directory.map.zoomIn'), icon: <Plus />, disabled: k >= MAX_ZOOM - 0.01 },
    { key: 'out', label: t('directory.map.zoomOut'), icon: <Minus />, disabled: k <= 1.01 },
    { key: 'reset', label: t('directory.map.reset'), icon: <Globe />, disabled: k <= 1.01 && !selected },
  ];
  const handleControl = (key: string) => {
    if (key === 'in') zoomBy(2);
    else if (key === 'out') zoomBy(0.5);
    else showWorld();
  };

  let content = null;
  if (geometry) {
    const { countries } = geometry;
    const ppu = size.width ? pixelsPerUnit(view, size.width, size.height) : 1;
    // Markers are drawn in screen pixels, a little smaller on phones.
    const sizeFactor = size.width ? Math.min(1, Math.max(0.75, size.width / 900)) : 1;
    const scale = sizeFactor / ppu;
    const markerCodes = Object.keys(counts)
      .filter((code) => counts[code] > 0 && countries[code])
      .sort((a, b) => counts[b] - counts[a]);
    const markerTransform = (code: string) =>
      `translate(${countries[code].x} ${countries[code].y}) scale(${scale})`;
    const inView = (code: string) => {
      const { x, y } = countries[code];
      return x >= view.x && x <= view.x + view.w && y >= view.y && y <= view.y + view.h;
    };
    const hotCodes = [...new Set([selected, hovered, focused])].filter(
      (code): code is string => Boolean(code) && markerCodes.includes(code as string),
    );
    const overlayCodes = [...new Set([selected, hovered])].filter(
      (code): code is string => Boolean(code) && markerCodes.includes(code as string),
    );
    const denseLabelCodes =
      k >= DENSE_LABEL_ZOOM ? markerCodes.filter((code) => inView(code) && !hotCodes.includes(code)) : [];

    content = (
      <svg
        ref={svgRef}
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
        preserveAspectRatio="xMidYMid meet"
        className={`absolute inset-0 h-full w-full touch-none select-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        role="group"
        aria-label={t('directory.map.label')}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <defs>
          <filter id={SHADOW_ID} x="-20%" y="-40%" width="140%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.28" />
          </filter>
        </defs>

        <path
          d={graticulePath(bounds)}
          className="fill-none stroke-sky-300/60 dark:stroke-slate-600/50"
          strokeWidth={0.75}
          vectorEffect="non-scaling-stroke"
          aria-hidden="true"
        />

        <LandLayer
          countries={countries}
          counts={counts}
          selected={selected}
          hovered={hovered}
          onHover={handleHover}
        />

        {/* Bubbles sit above every country path so none is covered. */}
        <g>
          {markerCodes.map((code) => {
            const count = counts[code];
            const label = `${countryName(code, lang)}: ${t('directory.networkCount', { count })}`;
            return (
              <g
                key={code}
                data-code={code}
                role="button"
                tabIndex={0}
                aria-pressed={selected === code}
                aria-label={label}
                className="cursor-pointer outline-none"
                transform={markerTransform(code)}
                onKeyDown={(event) => handleBubbleKeyDown(event, code)}
                onPointerEnter={() => setHovered(code)}
                onPointerLeave={() => setHovered((current) => (current === code ? null : current))}
                onFocus={(event) => {
                  // Ring only for keyboard focus, not after a mouse click.
                  if (event.currentTarget.matches(':focus-visible')) setFocused(code);
                }}
                onBlur={() => setFocused((current) => (current === code ? null : current))}
              >
                <title>{label}</title>
                <circle r={bubbleRadius(count) + 6} fill="transparent" />
                <BubbleVisual
                  count={count}
                  isSelected={selected === code}
                  isHot={hovered === code}
                  isFocused={focused === code}
                />
              </g>
            );
          })}
        </g>

        {/* Dense-area labels once zoomed in. */}
        {denseLabelCodes.length > 0 && (
          <g aria-hidden="true" className="pointer-events-none">
            {denseLabelCodes.map((code) => (
              <g key={code} transform={markerTransform(code)}>
                <text
                  y={bubbleRadius(counts[code]) + 12}
                  textAnchor="middle"
                  fontSize={11}
                  strokeWidth={3}
                  strokeLinejoin="round"
                  style={{ paintOrder: 'stroke' }}
                  className="fill-slate-800 stroke-white font-semibold dark:fill-slate-100 dark:stroke-slate-900"
                >
                  {countryName(code, lang)}
                </text>
              </g>
            ))}
          </g>
        )}

        {/* Hovered and selected bubbles redrawn on top, plus their name pills. */}
        <g aria-hidden="true" className="pointer-events-none">
          {overlayCodes.map((code) => (
            <g key={code} transform={markerTransform(code)}>
              {selected === code && (
                <circle
                  r={bubbleRadius(counts[code])}
                  className="fill-none stroke-amber-500 motion-safe:animate-ping"
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  strokeWidth={3}
                  vectorEffect="non-scaling-stroke"
                />
              )}
              <BubbleVisual
                count={counts[code]}
                isSelected={selected === code}
                isHot={hovered === code}
                isFocused={focused === code}
              />
            </g>
          ))}
          {hotCodes.map((code) => {
            const { x, y } = countries[code];
            const isSelected = selected === code;
            const text = `${countryName(code, lang)} · ${counts[code]}`;
            const width = text.length * 6.9 + 24;
            const half = width / 2;
            const r = bubbleRadius(counts[code]) * 1.15;
            // Keep the pill inside the visible map.
            const left = (view.x - x) / scale + half + 6;
            const right = (view.x + view.w - x) / scale - half - 6;
            const offsetX = left > right ? 0 : Math.min(Math.max(0, left), right);
            const spaceAbove = (y - view.y) / scale;
            const top = spaceAbove > r + PILL_HEIGHT + 14 ? -(r + 8 + PILL_HEIGHT) : r + 8;
            return (
              <g key={`pill-${code}`} transform={markerTransform(code)}>
                <rect
                  x={offsetX - half}
                  y={top}
                  width={width}
                  height={PILL_HEIGHT}
                  rx={PILL_HEIGHT / 2}
                  filter={`url(#${SHADOW_ID})`}
                  className={isSelected ? 'fill-amber-700' : 'fill-primary'}
                />
                <text
                  x={offsetX}
                  y={top + PILL_HEIGHT / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={12}
                  className={`font-semibold ${isSelected ? 'fill-white' : 'fill-primary-foreground'}`}
                >
                  {text}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    );
  }

  return (
    <div onKeyDown={handleMapKeyDown}>
      <div className="relative">
        <div
          ref={containerRef}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-gradient-to-b from-sky-50 to-blue-100 shadow-sm sm:aspect-[960/500] dark:from-slate-900 dark:to-slate-800"
        >
          {content ?? <div className="absolute inset-0 animate-pulse bg-muted/60" aria-hidden="true" />}

          <div className="pointer-events-none absolute left-3 top-3 hidden max-w-[70%] sm:block">{hint}</div>

          <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-xl border bg-background/90 shadow-sm backdrop-blur-sm">
            {controls.map((control, index) => (
              <Tooltip key={control.key}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-9 w-9 rounded-none ${index > 0 ? 'border-t' : ''}`}
                    aria-label={control.label}
                    disabled={control.disabled}
                    onClick={() => handleControl(control.key)}
                  >
                    {control.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">{control.label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="mt-3 sm:pointer-events-none sm:absolute sm:bottom-3 sm:left-3 sm:mt-0">
          <div className="sm:pointer-events-auto">{legend}</div>
        </div>
      </div>
      <div className="mt-2 sm:hidden">{hint}</div>
    </div>
  );
}
