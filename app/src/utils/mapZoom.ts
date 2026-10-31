// Pure helpers for the zoomable world map. No DOM access, so they can be unit tested.

export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface MapBounds {
  width: number;
  height: number;
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 12;

// Full-world view for a container of the given aspect ratio (width / height).
export function worldViewBox(bounds: MapBounds, aspect: number): ViewBox {
  return clampViewBox({ x: 0, y: 0, w: bounds.width, h: bounds.width / aspect }, bounds, aspect);
}

function clampAxis(start: number, size: number, limit: number): number {
  // A view larger than the map is centered; a smaller one stays inside it.
  if (size >= limit) return (limit - size) / 2;
  return Math.min(Math.max(start, 0), limit - size);
}

// Keeps the zoom between MIN_ZOOM and maxZoom, the aspect ratio fixed, and
// the view inside the map. Zoom is relative to the map width.
export function clampViewBox(viewBox: ViewBox, bounds: MapBounds, aspect: number, maxZoom = MAX_ZOOM): ViewBox {
  const w = Math.min(Math.max(viewBox.w, bounds.width / maxZoom), bounds.width / MIN_ZOOM);
  const h = w / aspect;
  const centerX = viewBox.x + viewBox.w / 2;
  const centerY = viewBox.y + viewBox.h / 2;
  return {
    x: clampAxis(centerX - w / 2, w, bounds.width),
    y: clampAxis(centerY - h / 2, h, bounds.height),
    w,
    h,
  };
}

export function zoomLevel(viewBox: ViewBox, bounds: MapBounds): number {
  return bounds.width / viewBox.w;
}

// Zooms by `factor` (>1 zooms in) while keeping `point` (map units) fixed on screen.
export function zoomAt(
  viewBox: ViewBox,
  factor: number,
  point: Point,
  bounds: MapBounds,
  aspect: number,
  maxZoom = MAX_ZOOM,
): ViewBox {
  const w = Math.min(Math.max(viewBox.w / factor, bounds.width / maxZoom), bounds.width / MIN_ZOOM);
  const ratio = w / viewBox.w;
  const next = {
    x: point.x - (point.x - viewBox.x) * ratio,
    y: point.y - (point.y - viewBox.y) * ratio,
    w,
    h: w / aspect,
  };
  return clampViewBox(next, bounds, aspect, maxZoom);
}

export function panBy(viewBox: ViewBox, dx: number, dy: number, bounds: MapBounds, aspect: number): ViewBox {
  return clampViewBox({ ...viewBox, x: viewBox.x + dx, y: viewBox.y + dy }, bounds, aspect);
}

// View that fits `box` with `pad` (0.4 = 40%) extra room, at least `minWidth`
// map units wide, at the container aspect ratio, inside the map.
export function fitBox(box: Box, aspect: number, minWidth: number, bounds: MapBounds, pad = 0.4): ViewBox {
  let w = Math.max(box.width * (1 + pad), box.height * (1 + pad) * aspect, minWidth);
  w = Math.min(w, bounds.width);
  const h = w / aspect;
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  return clampViewBox({ x: centerX - w / 2, y: centerY - h / 2, w, h }, bounds, aspect);
}

// Pixels per map unit for an SVG drawn with preserveAspectRatio="xMidYMid meet".
export function pixelsPerUnit(viewBox: ViewBox, clientWidth: number, clientHeight: number): number {
  return Math.min(clientWidth / viewBox.w, clientHeight / viewBox.h);
}

// Converts a point in element pixels (relative to its top-left) to map units.
export function clientToMap(viewBox: ViewBox, clientWidth: number, clientHeight: number, point: Point): Point {
  const ppu = pixelsPerUnit(viewBox, clientWidth, clientHeight);
  const offsetX = (clientWidth - viewBox.w * ppu) / 2;
  const offsetY = (clientHeight - viewBox.h * ppu) / 2;
  return {
    x: viewBox.x + (point.x - offsetX) / ppu,
    y: viewBox.y + (point.y - offsetY) / ppu,
  };
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function interpolateViewBox(from: ViewBox, to: ViewBox, t: number): ViewBox {
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
    w: from.w + (to.w - from.w) * t,
    h: from.h + (to.h - from.h) * t,
  };
}

// Bounds of an absolute "M/L/Z" path near `anchor`. Subpaths whose center lies
// more than `maxDistance` map units away are skipped, so countries split by the
// antimeridian (Fiji, Kiribati, Russia) zoom to their main side, not the whole map.
export function pathBounds(d: string, anchor: Point, maxDistance = 240): Box | null {
  const boxes: Box[] = [];
  for (const segment of d.split(/[Zz]/)) {
    const numbers = segment.match(/-?\d+(?:\.\d+)?(?:e-?\d+)?/gi);
    if (!numbers || numbers.length < 2) continue;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let i = 0; i + 1 < numbers.length; i += 2) {
      const x = Number(numbers[i]);
      const y = Number(numbers[i + 1]);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    boxes.push({ x: minX, y: minY, width: maxX - minX, height: maxY - minY });
  }
  const near = boxes.filter((box) => {
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    return Math.hypot(cx - anchor.x, cy - anchor.y) <= maxDistance;
  });
  if (near.length === 0) return null;
  const minX = Math.min(...near.map((box) => box.x));
  const minY = Math.min(...near.map((box) => box.y));
  const maxX = Math.max(...near.map((box) => box.x + box.width));
  const maxY = Math.max(...near.map((box) => box.y + box.height));
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

// Bubble radius in screen pixels: about 10 for one network, about 18 for 175.
export function bubbleRadius(count: number): number {
  return Math.min(20, 10 + 1.075 * Math.log2(Math.max(1, count)));
}

// Regional-indicator flag for an ISO 3166-1 alpha-2 code; empty for anything else.
export function flagEmoji(code: string | null | undefined): string {
  if (!code || !/^[A-Za-z]{2}$/.test(code)) return '';
  return String.fromCodePoint(...code.toUpperCase().split('').map((char) => 0x1f1e6 + char.charCodeAt(0) - 65));
}

// Draw order for count bubbles: larger counts first (underneath), the
// selected marker last so the bubble on top is also the one that gets clicks.
export function markerOrder(codes: string[], counts: Record<string, number>, selected: string | null): string[] {
  return [...codes].sort((a, b) => {
    if (a === selected) return 1;
    if (b === selected) return -1;
    return counts[b] - counts[a] || a.localeCompare(b);
  });
}

export interface MarkerCircle {
  code: string;
  x: number;
  y: number;
  r: number;
}

// Hit radius per marker, given in draw order. A marker gets `pad` extra room
// around its circle, but never so much that it covers the visible circle of a
// marker drawn underneath it.
export function hitRadii(markers: MarkerCircle[], pad = 6): Record<string, number> {
  const radii: Record<string, number> = {};
  markers.forEach((marker, index) => {
    let hit = marker.r + pad;
    for (let below = 0; below < index; below += 1) {
      const other = markers[below];
      const distance = Math.hypot(marker.x - other.x, marker.y - other.y);
      if (distance - other.r < hit) hit = Math.max(marker.r, distance - other.r);
    }
    radii[marker.code] = hit;
  });
  return radii;
}
