import { describe, it, expect, vi } from 'vitest';
import {
  computePdfPageSlices,
  isCaptureLayoutConsistent,
  type PdfBlockBox,
  type PdfPageSlice,
} from '@/utils/pdfGenerator';

// pdfGenerator imports i18n, which touches `document` at load time; the node test env has none.
vi.mock('@/i18n/i18n', () => ({ default: { t: (key: string) => key } }));

// Canvas maps 10 px per mm, so a page holds 1000 canvas px (100mm content height).
const CANVAS_WIDTH = 1000;
const CONTENT_WIDTH_MM = 100;
const CONTENT_HEIGHT_MM = 100;
const PAGE_PX = 1000;

const slice = (
  canvasHeight: number,
  blocks: PdfBlockBox[] = []
): PdfPageSlice[] =>
  computePdfPageSlices(CANVAS_WIDTH, canvasHeight, CONTENT_WIDTH_MM, CONTENT_HEIGHT_MM, blocks);

const bounds = (slices: PdfPageSlice[]) =>
  slices.map(s => [s.sourceY, s.sourceY + s.sourceHeight]);

// Slices must be contiguous, non-empty and no taller than a page
const assertWellFormed = (slices: PdfPageSlice[], canvasHeight: number) => {
  let expectedY = 0;
  for (const s of slices) {
    expect(s.sourceY).toBe(expectedY);
    expect(s.sourceHeight).toBeGreaterThan(0);
    expect(s.sourceHeight).toBeLessThanOrEqual(PAGE_PX);
    expectedY += s.sourceHeight;
  }
  expect(expectedY).toBeLessThanOrEqual(canvasHeight);
};

describe('computePdfPageSlices', () => {
  it('ends pages at the largest safe block boundary in the page window', () => {
    const blocks: PdfBlockBox[] = [
      { top: 0, bottom: 400 },
      { top: 400, bottom: 900 },
      { top: 900, bottom: 1450 },
      { top: 1450, bottom: 2000 },
      { top: 2000, bottom: 2500 },
    ];
    const slices = slice(2500, blocks);
    expect(bounds(slices)).toEqual([[0, 900], [900, 1450], [1450, 2000], [2000, 2500]]);
    assertWellFormed(slices, 2500);
  });

  it('never cuts a block that fits on one page', () => {
    const blocks: PdfBlockBox[] = [
      { top: 0, bottom: 600 },
      { top: 600, bottom: 1300 },
      { top: 1300, bottom: 1900 },
    ];
    const slices = slice(1900, blocks);
    const ends = bounds(slices).map(([, end]) => end);
    for (const end of ends.slice(0, -1)) {
      expect(blocks.some(b => b.top < end && end < b.bottom)).toBe(false);
    }
    expect(bounds(slices)).toEqual([[0, 600], [600, 1300], [1300, 1900]]);
  });

  it('skips a break inside a larger block and uses the next safe one', () => {
    // 900 is inside the card [500, 1050], so it is unsafe; 500 is the next safe break
    const blocks: PdfBlockBox[] = [
      { top: 0, bottom: 500 },
      { top: 500, bottom: 1050 },
      { top: 700, bottom: 900 },
    ];
    const slices = slice(1500, blocks);
    expect(bounds(slices)).toEqual([[0, 500], [500, 1500]]);
    assertWellFormed(slices, 1500);
  });

  it('does not end a page right after a heading', () => {
    // The heading bottom at 1000 would be the largest break, but headings are not breakable
    const blocks: PdfBlockBox[] = [
      { top: 0, bottom: 700 },
      { top: 700, bottom: 1000, breakable: false },
      { top: 1000, bottom: 1500 },
    ];
    expect(bounds(slice(1500, blocks))).toEqual([[0, 700], [700, 1500]]);
  });

  it('accepts a safe break in the upper half of the page', () => {
    expect(bounds(slice(2000, [{ top: 0, bottom: 400 }]))).toEqual([[0, 400], [400, 1400], [1400, 2000]]);
  });

  it('does not cut a 450-1150 card when a safe break exists at 450', () => {
    const blocks: PdfBlockBox[] = [
      { top: 0, bottom: 450 },
      { top: 450, bottom: 1150 },
      { top: 1150, bottom: 1600 },
    ];
    expect(bounds(slice(1600, blocks))).toEqual([[0, 450], [450, 1150], [1150, 1600]]);
  });

  it('starts a page at a card top when no earlier block bottom is available', () => {
    // Regression: a fitting card at 450-1150 with no preceding block must not hard-cut at 1000
    const blocks: PdfBlockBox[] = [{ top: 450, bottom: 1150 }];
    const slices = slice(1600, blocks);
    expect(slices[0]).toEqual({ sourceY: 0, sourceHeight: 450 });
    expect(bounds(slices)).toEqual([[0, 450], [450, 1150], [1150, 1600]]);
    assertWellFormed(slices, 1600);
  });

  it('does not orphan a heading whose card starts at the heading bottom', () => {
    // The card top at 500 equals the heading bottom: breaking there would strand the heading
    // at a page bottom, so the page ends at the earlier safe break (300) and the heading moves with the card
    const blocks: PdfBlockBox[] = [
      { top: 0, bottom: 300 },
      { top: 300, bottom: 500, breakable: false },
      { top: 500, bottom: 1100 },
    ];
    expect(bounds(slice(1100, blocks))).toEqual([[0, 300], [300, 1100]]);
  });

  it('breaks inside an oversized parent between its children', () => {
    // The parent is taller than a page, so it must not forbid breaks between its children
    const blocks: PdfBlockBox[] = [
      { top: 0, bottom: 1500 },
      { top: 100, bottom: 300 },
      { top: 300, bottom: 700 },
      { top: 700, bottom: 1100 },
      { top: 1100, bottom: 1500 },
    ];
    const slices = slice(1500, blocks);
    expect(bounds(slices)).toEqual([[0, 700], [700, 1500]]);
    assertWellFormed(slices, 1500);
  });

  it('terminates for blocks several pages tall', () => {
    const blocks: PdfBlockBox[] = [
      { top: 0, bottom: 2600 },
      { top: 2600, bottom: 5000 },
    ];
    const slices = slice(5000, blocks);
    // Oversized blocks cannot hold a break; only the 2600 boundary is safe
    expect(bounds(slices)).toEqual([
      [0, 1000], [1000, 2000], [2000, 2600], [2600, 3600], [3600, 4600], [4600, 5000],
    ]);
    assertWellFormed(slices, 5000);
  });

  it('falls back to hard page height when there are no blocks', () => {
    expect(bounds(slice(2500))).toEqual([[0, 1000], [1000, 2000], [2000, 2500]]);
  });

  it('falls back to hard height for a block taller than a page and terminates', () => {
    const blocks: PdfBlockBox[] = [{ top: 0, bottom: 2400 }];
    const slices = slice(2500, blocks);
    expect(bounds(slices)).toEqual([[0, 1000], [1000, 2000], [2000, 2500]]);
    assertWellFormed(slices, 2500);
  });

  it('returns exactly N pages when height is N page-heights', () => {
    expect(bounds(slice(3000))).toEqual([[0, 1000], [1000, 2000], [2000, 3000]]);
    const blocks: PdfBlockBox[] = [{ top: 0, bottom: 1000 }, { top: 1000, bottom: 2000 }];
    expect(bounds(slice(2000, blocks))).toEqual([[0, 1000], [1000, 2000]]);
  });

  it('keeps content that is less than one page as a single page', () => {
    expect(bounds(slice(800))).toEqual([[0, 800]]);
  });

  it('drops a near-empty final sliver with no block content', () => {
    // 15px is 1.5% of a page
    const slices = slice(2015);
    expect(bounds(slices)).toEqual([[0, 1000], [1000, 2000]]);
    assertWellFormed(slices, 2015);
  });

  it('keeps a final sliver that holds block content', () => {
    // The card top at 1990 is now a safe break, so the card moves whole to the final page
    const blocks: PdfBlockBox[] = [{ top: 1990, bottom: 2015 }];
    expect(bounds(slice(2015, blocks))).toEqual([[0, 1000], [1000, 1990], [1990, 2015]]);
  });

  it('keeps a tiny canvas that is the only page', () => {
    expect(bounds(slice(10))).toEqual([[0, 10]]);
  });

  it('returns no pages for an empty canvas or invalid page size', () => {
    expect(slice(0)).toEqual([]);
    expect(computePdfPageSlices(0, 100, CONTENT_WIDTH_MM, CONTENT_HEIGHT_MM)).toEqual([]);
    expect(computePdfPageSlices(CANVAS_WIDTH, 100, CONTENT_WIDTH_MM, 0)).toEqual([]);
  });

  it('keeps every page well formed for random block layouts', () => {
    let seed = 42;
    const random = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    for (let round = 0; round < 200; round++) {
      const canvasHeight = 1 + Math.floor(random() * 6000);
      const blocks: PdfBlockBox[] = [];
      let cursor = 0;
      while (cursor < canvasHeight) {
        const height = 1 + Math.floor(random() * 1400);
        const bottom = Math.min(canvasHeight, cursor + height);
        blocks.push({ top: cursor, bottom });
        cursor = bottom;
      }
      assertWellFormed(slice(canvasHeight, blocks), canvasHeight);
    }
  });
});

describe('isCaptureLayoutConsistent', () => {
  it('accepts a canvas that matches the live height at the capture scale', () => {
    // 1000 css px at scale 2 is 2000 canvas px
    expect(isCaptureLayoutConsistent(2000, 1000, 2)).toBe(true);
  });

  it('accepts pixel rounding', () => {
    expect(isCaptureLayoutConsistent(2001, 1000, 2)).toBe(true);
  });

  it('rejects an unstyled capture that is taller than the live layout', () => {
    expect(isCaptureLayoutConsistent(2600, 1000, 2)).toBe(false);
  });

  it('rejects a capture shorter than the live layout', () => {
    expect(isCaptureLayoutConsistent(1500, 1000, 2)).toBe(false);
  });
});
