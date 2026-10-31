import { describe, it, expect } from 'vitest';
import {
  countByCountry,
  countryName,
  filterNetworks,
  tierFor,
  type CommunityNetwork,
} from '@/utils/communityDirectory';
import {
  MAX_ZOOM,
  bubbleRadius,
  clampViewBox,
  clientToMap,
  easeInOutCubic,
  fitBox,
  flagEmoji,
  hitRadii,
  interpolateViewBox,
  markerOrder,
  panBy,
  pathBounds,
  pixelsPerUnit,
  worldViewBox,
  zoomAt,
  zoomLevel,
} from '@/utils/mapZoom';

const networks: CommunityNetwork[] = [
  { id: '1', name: 'São Paulo Mesh', country: 'BR', status: 'active', services: ['internet'], sources: ['ccci'] },
  { id: '2', name: 'Sao Jorge Radio', country: 'BR', status: 'pilot', services: ['radio'], sources: ['ccci'] },
  { id: '3', name: 'Kibera Net', country: 'KE', status: 'active', services: ['internet', 'schools'], sources: ['communityBox'] },
  { id: '4', name: 'Nairobi Relay', country: 'KE', status: 'dormant', services: ['voice'], sources: ['ccci'] },
  { id: '5', name: 'Unknown Place', country: null, status: 'unknown', services: [], sources: ['ccci'] },
];

describe('countByCountry', () => {
  it('counts networks per ISO2 code and ignores null countries', () => {
    expect(countByCountry(networks)).toEqual({ BR: 2, KE: 2 });
  });

  it('returns an empty record for no networks', () => {
    expect(countByCountry([])).toEqual({});
  });
});

describe('filterNetworks', () => {
  it('returns everything when no filters are set', () => {
    expect(filterNetworks(networks, {})).toHaveLength(5);
  });

  it('filters by country', () => {
    expect(filterNetworks(networks, { country: 'KE' }).map((n) => n.id)).toEqual(['3', '4']);
  });

  it('filters by status', () => {
    expect(filterNetworks(networks, { status: 'pilot' }).map((n) => n.id)).toEqual(['2']);
  });

  it('matches the query case- and accent-insensitively', () => {
    expect(filterNetworks(networks, { query: 'SAO' }).map((n) => n.id)).toEqual(['1', '2']);
    expect(filterNetworks(networks, { query: 'paulo' }).map((n) => n.id)).toEqual(['1']);
  });

  it('ignores blank queries and null filters', () => {
    expect(filterNetworks(networks, { query: '   ', country: null, status: null })).toHaveLength(5);
  });

  it('combines country, status and query', () => {
    expect(filterNetworks(networks, { country: 'BR', status: 'active', query: 'mesh' }).map((n) => n.id)).toEqual(['1']);
    expect(filterNetworks(networks, { country: 'KE', status: 'pilot' })).toEqual([]);
  });
});

describe('tierFor', () => {
  it('maps counts onto the four tiers at their boundaries', () => {
    expect(tierFor(1)).toBe(1);
    expect(tierFor(2)).toBe(2);
    expect(tierFor(5)).toBe(2);
    expect(tierFor(6)).toBe(3);
    expect(tierFor(20)).toBe(3);
    expect(tierFor(21)).toBe(4);
    expect(tierFor(448)).toBe(4);
  });
});

describe('countryName', () => {
  it('returns a localized region name for a valid code', () => {
    expect(countryName('BR', 'en')).toBe('Brazil');
    expect(countryName('BR', 'pt')).toBe('Brasil');
  });

  it('falls back to the code for an invalid code', () => {
    expect(countryName('NOT-A-CODE', 'en')).toBe('NOT-A-CODE');
    expect(countryName('', 'en')).toBe('');
  });
});

describe('mapZoom helpers', () => {
  const bounds = { width: 960, height: 500 };
  const aspect = 960 / 500;

  it('builds the world view and centers it on taller containers', () => {
    expect(worldViewBox(bounds, aspect)).toEqual({ x: 0, y: 0, w: 960, h: 500 });
    const phone = worldViewBox(bounds, 4 / 3);
    expect(phone.w).toBe(960);
    expect(phone.h).toBe(720);
    expect(phone.y).toBe(-110);
  });

  it('clamps zoom between 1x and 12x and keeps the view inside the map', () => {
    expect(clampViewBox({ x: -50, y: -50, w: 2000, h: 100 }, bounds, aspect)).toEqual({ x: 0, y: 0, w: 960, h: 500 });
    const tiny = clampViewBox({ x: 900, y: 480, w: 10, h: 10 }, bounds, aspect);
    expect(tiny.w).toBeCloseTo(80);
    expect(tiny.x + tiny.w).toBeLessThanOrEqual(960);
    expect(tiny.y + tiny.h).toBeLessThanOrEqual(500);
    expect(zoomLevel(tiny, bounds)).toBeCloseTo(MAX_ZOOM);
  });

  it('zooms around a point that stays fixed', () => {
    const world = worldViewBox(bounds, aspect);
    const zoomed = zoomAt(world, 2, { x: 480, y: 250 }, bounds, aspect);
    expect(zoomed).toEqual({ x: 240, y: 125, w: 480, h: 250 });
    const corner = zoomAt(world, 4, { x: 0, y: 0 }, bounds, aspect);
    expect(corner.x).toBe(0);
    expect(corner.y).toBe(0);
    expect(zoomAt(world, 0.5, { x: 100, y: 100 }, bounds, aspect)).toEqual(world);
  });

  it('pans within the map bounds', () => {
    const view = { x: 240, y: 125, w: 480, h: 250 };
    expect(panBy(view, 10, -5, bounds, aspect)).toEqual({ x: 250, y: 120, w: 480, h: 250 });
    expect(panBy(view, 9999, 9999, bounds, aspect)).toEqual({ x: 480, y: 250, w: 480, h: 250 });
  });

  it('fits a box with padding, a minimum size and the container aspect', () => {
    const fitted = fitBox({ x: 400, y: 200, width: 100, height: 50 }, aspect, 120, bounds);
    expect(fitted.w).toBeCloseTo(140);
    expect(fitted.w / fitted.h).toBeCloseTo(aspect);
    expect(fitted.x + fitted.w / 2).toBeCloseTo(450);
    const island = fitBox({ x: 57, y: 348, width: 0.3, height: 0.2 }, aspect, 120, bounds);
    expect(island.w).toBe(120);
    expect(zoomLevel(island, bounds)).toBe(8);
    expect(island.x).toBe(0);
  });

  it('maps element pixels to map units with letterboxing', () => {
    const view = { x: 0, y: 0, w: 960, h: 500 };
    expect(pixelsPerUnit(view, 480, 250)).toBe(0.5);
    expect(clientToMap(view, 480, 250, { x: 240, y: 125 })).toEqual({ x: 480, y: 250 });
    // Taller element: 960x500 content is centered vertically.
    expect(clientToMap(view, 480, 450, { x: 0, y: 100 })).toEqual({ x: 0, y: 0 });
  });

  it('eases and interpolates view boxes', () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(0.5)).toBe(0.5);
    expect(easeInOutCubic(1)).toBe(1);
    expect(interpolateViewBox({ x: 0, y: 0, w: 960, h: 500 }, { x: 100, y: 50, w: 480, h: 250 }, 0.5)).toEqual({
      x: 50,
      y: 25,
      w: 720,
      h: 375,
    });
  });

  it('measures path bounds and skips subpaths across the antimeridian', () => {
    const d = 'M953.9,336.6L955.4,337L951.4,338.6ZM0,332.1L0.5,331.9L0.4,333.6Z';
    const box = pathBounds(d, { x: 953.3, y: 337.6 });
    expect(box).toEqual({ x: 951.4, y: 336.6, width: 4, height: 2 });
    expect(pathBounds(d, { x: 500, y: 100 })).toBeNull();
    expect(pathBounds('', { x: 0, y: 0 })).toBeNull();
  });

  it('scales bubble radius with the count', () => {
    expect(bubbleRadius(1)).toBe(10);
    expect(bubbleRadius(175)).toBeCloseTo(18, 0);
    expect(bubbleRadius(3)).toBeGreaterThan(bubbleRadius(2));
    expect(bubbleRadius(100000)).toBe(20);
    expect(bubbleRadius(0)).toBe(10);
  });

  it('builds flag emoji from ISO codes', () => {
    expect(flagEmoji('BR')).toBe('🇧🇷');
    expect(flagEmoji('ck')).toBe('🇨🇰');
    expect(flagEmoji('B1')).toBe('');
    expect(flagEmoji('BRA')).toBe('');
    expect(flagEmoji(null)).toBe('');
  });

  it('draws larger counts first and the selected marker last', () => {
    const counts = { VU: 2, SB: 3, BR: 16, AU: 3 };
    expect(markerOrder(['VU', 'SB', 'BR', 'AU'], counts, null)).toEqual(['BR', 'AU', 'SB', 'VU']);
    expect(markerOrder(['VU', 'SB', 'BR', 'AU'], counts, 'SB')).toEqual(['BR', 'AU', 'VU', 'SB']);
    expect(markerOrder(['VU', 'SB'], counts, 'XX')).toEqual(['SB', 'VU']);
  });

  it('keeps hit areas off the visible circle of markers drawn underneath', () => {
    // Solomon Islands drawn first, Vanuatu (selected) on top, 9px apart.
    const radii = hitRadii([
      { code: 'SB', x: 0, y: 0, r: 11 },
      { code: 'VU', x: 9, y: 0, r: 11 },
    ]);
    expect(radii.SB).toBe(17);
    expect(radii.VU).toBe(11);
    const apart = hitRadii([
      { code: 'A', x: 0, y: 0, r: 10 },
      { code: 'B', x: 30, y: 0, r: 10 },
    ]);
    expect(apart.B).toBe(16);
    const near = hitRadii([
      { code: 'A', x: 0, y: 0, r: 10 },
      { code: 'B', x: 24, y: 0, r: 10 },
    ]);
    expect(near.B).toBe(14);
  });
});
