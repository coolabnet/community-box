import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { saveAs } from 'file-saver';
import i18n from '@/i18n/i18n';

// Define PDF generation options
interface PDFOptions {
  filename?: string;
  margin?: number;
  quality?: number;
  scale?: number;
}

// One page's window into the captured canvas, in canvas pixels
export interface PdfPageSlice {
  sourceY: number;
  sourceHeight: number;
}

// Vertical extent of an element that must not be cut by a page break, in canvas pixels
export interface PdfBlockBox {
  top: number;
  bottom: number;
  // False for headings: a page must not end right after a heading and leave it orphaned
  breakable?: boolean;
}

// Elements that must stay whole on one page. Cards opt in with data-pdf-block.
export const PDF_BREAK_SELECTOR = 'p, li, h1, h2, h3, h4, tr, [data-pdf-block]';

// A trailing remainder below this fraction of a page is dropped when it holds no block content.
const MIN_FINAL_SLIVER_FRACTION = 0.02;

// Split a captured canvas into page-height windows that never overlap and never cut a block.
// Each page ends at the largest safe break in (pageStart, pageStart + pageHeight]. Candidates are
// block tops and bottoms; a break is safe when it is not strictly inside any block. Blocks taller
// than a page do not count as containing a break, so their children can break. A break is never
// placed right after a heading (a non-breakable block), so a heading is not orphaned at a page
// bottom. A page is cut at full height only when no safe break exists, and every page advances,
// so the loop always terminates.
export const computePdfPageSlices = (
  canvasWidth: number,
  canvasHeight: number,
  pageContentWidthMm: number,
  pageContentHeightMm: number,
  blocks: PdfBlockBox[] = []
): PdfPageSlice[] => {
  if (
    canvasWidth <= 0 ||
    canvasHeight <= 0 ||
    pageContentWidthMm <= 0 ||
    pageContentHeightMm <= 0
  ) {
    return [];
  }

  const pxPerMm = canvasWidth / pageContentWidthMm;
  const maxSlicePx = Math.floor(pageContentHeightMm * pxPerMm);
  if (maxSlicePx < 1) {
    return [];
  }

  // Oversized blocks cannot stay whole on one page, so they never forbid a break inside them
  const containingBlocks = blocks.filter(block => block.bottom - block.top <= maxSlicePx);
  const isSafeBreak = (y: number) =>
    !containingBlocks.some(block => block.top < y && y < block.bottom);
  // Heading bottoms are never breaks: the break would leave the heading at the page bottom
  const headingBottoms = new Set(
    blocks.filter(block => block.breakable === false).map(block => block.bottom)
  );
  // A block top starts a page cleanly, and a block bottom ends one; headings only contribute tops
  const candidateSet = new Set<number>();
  for (const block of blocks) {
    candidateSet.add(block.top);
    if (block.breakable !== false) {
      candidateSet.add(block.bottom);
    }
  }
  // Largest candidates first, so the first match is the largest valid break
  const breakCandidates = Array.from(candidateSet)
    .filter(y => y > 0 && y < canvasHeight && !headingBottoms.has(y))
    .sort((a, b) => b - a);

  const slices: PdfPageSlice[] = [];
  let start = 0;

  while (canvasHeight - start > maxSlicePx) {
    const limit = start + maxSlicePx;
    const safeBreak = breakCandidates.find(y => y > start && y <= limit && isSafeBreak(y));
    const end = safeBreak ?? limit;
    slices.push({ sourceY: start, sourceHeight: end - start });
    start = end;
  }

  const remaining = canvasHeight - start;
  if (remaining > 0) {
    const isSliver = remaining < maxSlicePx * MIN_FINAL_SLIVER_FRACTION;
    const holdsBlockContent = blocks.some(block => block.bottom > start && block.top < canvasHeight);
    // Keep the remainder when it is the only page, so content is never dropped entirely
    const dropSliver = isSliver && !holdsBlockContent && slices.length > 0;
    if (!dropSliver) {
      slices.push({ sourceY: start, sourceHeight: remaining });
    }
  }

  return slices;
};

const MAX_CAPTURE_ATTEMPTS = 3;
const CAPTURE_RETRY_DELAY_MS = 300;

// True when a captured canvas height matches the live element height at the capture scale.
// A small tolerance absorbs pixel rounding.
export const isCaptureLayoutConsistent = (
  canvasHeight: number,
  cssHeight: number,
  scale: number
): boolean => {
  const expectedHeight = cssHeight * scale;
  const tolerance = Math.max(2, expectedHeight * 0.01);
  return Math.abs(canvasHeight - expectedHeight) <= tolerance;
};

// Measure the safe break boxes of the rendered template, in canvas pixels.
export const collectPdfBlockBoxes = (root: HTMLElement, pxPerCssPx: number): PdfBlockBox[] => {
  const rootTop = root.getBoundingClientRect().top;
  return Array.from(root.querySelectorAll<HTMLElement>(PDF_BREAK_SELECTOR))
    .map(element => {
      const rect = element.getBoundingClientRect();
      return {
        top: (rect.top - rootTop) * pxPerCssPx,
        bottom: (rect.bottom - rootTop) * pxPerCssPx,
        breakable: !/^H[1-6]$/.test(element.tagName),
      };
    })
    .filter(block => block.bottom > block.top);
};

// Function to generate PDF from HTML element
export const generatePDF = async (
  element: HTMLElement,
  options: PDFOptions = {}
): Promise<Blob> => {
  const {
    filename = 'community-box-recommendation.pdf',
    margin = 10,
    quality = 0.95,
    scale = 2,
  } = options;
  // JPEG quality must be within 0..1
  const jpegQuality = Math.min(1, Math.max(0, quality));

  // Create a new PDF document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Get the width and height of the PDF document
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  try {
    // Capture the HTML element as a canvas. html2canvas clones the page and can capture before
    // the stylesheet has loaded in the clone, giving an unstyled canvas that no longer matches
    // the live layout, so recapture while the heights disagree.
    const captureOptions = {
      scale,
      useCORS: true,
      logging: false,
      allowTaint: true,
    };
    let canvas = await html2canvas(element, captureOptions);
    for (let attempt = 2; attempt <= MAX_CAPTURE_ATTEMPTS; attempt++) {
      if (isCaptureLayoutConsistent(canvas.height, element.getBoundingClientRect().height, scale)) {
        break;
      }
      console.warn(`PDF capture did not match the page layout; retrying (${attempt}/${MAX_CAPTURE_ATTEMPTS})`);
      await new Promise(resolve => setTimeout(resolve, CAPTURE_RETRY_DELAY_MS));
      canvas = await html2canvas(element, captureOptions);
    }

    // Calculate the content area of each page (same margins on every page)
    const contentWidth = pdfWidth - 2 * margin;
    const contentHeight = pdfHeight - 2 * margin;
    const pxPerMm = canvas.width / contentWidth;
    const elementWidth = element.getBoundingClientRect().width;
    const blocks = elementWidth > 0
      ? collectPdfBlockBoxes(element, canvas.width / elementWidth)
      : [];
    const slices = computePdfPageSlices(
      canvas.width,
      canvas.height,
      contentWidth,
      contentHeight,
      blocks
    );

    if (slices.length === 0) {
      throw new Error('Nothing to render into PDF: captured canvas is empty');
    }

    // Each page gets its own non-overlapping slice of the captured canvas
    slices.forEach((slice, index) => {
      if (index > 0) {
        pdf.addPage();
      }

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = slice.sourceHeight;
      const context = pageCanvas.getContext('2d');
      if (!context) {
        throw new Error('2D canvas context is unavailable for PDF page rendering');
      }
      context.drawImage(
        canvas,
        0, slice.sourceY, canvas.width, slice.sourceHeight,
        0, 0, canvas.width, slice.sourceHeight
      );

      const imgData = pageCanvas.toDataURL('image/jpeg', jpegQuality);
      pdf.addImage(
        imgData,
        'JPEG',
        margin,
        margin,
        contentWidth,
        slice.sourceHeight / pxPerMm
      );
    });

    // Return the PDF as a blob
    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Function to download the PDF
export const downloadPDF = async (
  element: HTMLElement,
  options: PDFOptions = {}
): Promise<void> => {
  try {
    const pdfBlob = await generatePDF(element, options);
    saveAs(pdfBlob, options.filename || 'community-box-recommendation.pdf');
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
};

// Function to share the PDF
export const sharePDF = async (
  element: HTMLElement,
  options: PDFOptions = {}
): Promise<void> => {
  try {
    const pdfBlob = await generatePDF(element, options);

    // Check if the Web Share API is available
    if (navigator.share) {
      const file = new File([pdfBlob], options.filename || 'community-box-recommendation.pdf', {
        type: 'application/pdf',
      });

      await navigator.share({
        title: i18n.t('questionnaire.questions.results.shareTitle'),
        text: i18n.t('questionnaire.questions.results.shareText'),
        files: [file],
      });
    } else {
      // Fallback to download if sharing is not available
      saveAs(pdfBlob, options.filename || 'community-box-recommendation.pdf');
    }
  } catch (error) {
    console.error('Error sharing PDF:', error);
    throw error;
  }
};
