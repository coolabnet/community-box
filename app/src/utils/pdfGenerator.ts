import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

// Define PDF generation options
interface PDFOptions {
  filename?: string;
  margin?: number;
  quality?: number;
  scale?: number;
}

// Function to generate PDF from HTML element
export const generatePDF = async (
  element: HTMLElement,
  options: PDFOptions = {}
): Promise<Blob> => {
  const {
    filename = 'community-box-recommendation.pdf',
    margin = 10,
    quality = 2,
    scale = 2,
  } = options;

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
    // Capture the HTML element as a canvas
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      allowTaint: true,
    });

    // Convert the canvas to an image
    const imgData = canvas.toDataURL('image/jpeg', quality);

    // Calculate the image dimensions to fit within the PDF
    const imgWidth = pdfWidth - 2 * margin;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add the image to the PDF
    let heightLeft = imgHeight;
    let position = 0;
    let pageCount = 1;

    // Add the first page
    pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
    heightLeft -= (pdfHeight - 2 * margin);

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 2 * margin);
      pageCount++;
    }

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

      // Use default text since we don't have access to translations here
      await navigator.share({
        title: 'Community Box Recommendation',
        text: 'Here is my Community Box recommendation',
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
