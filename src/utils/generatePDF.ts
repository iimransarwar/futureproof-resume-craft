
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

export async function generatePDF(elementId: string, fileName: string): Promise<void> {
  try {
    toast.loading('Generating PDF...');
    
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Clone the element to avoid modifying the original
    const clone = element.cloneNode(true) as HTMLElement;
    // Reset any transform scales to ensure proper rendering
    clone.style.transform = 'none';
    clone.style.width = '210mm'; // A4 width
    clone.style.height = 'auto';
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';
    document.body.appendChild(clone);

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      windowWidth: 794, // A4 width in pixels at 96 DPI
      windowHeight: 1123, // A4 height in pixels at 96 DPI
    });

    document.body.removeChild(clone);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add the image to the PDF
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // If the content is taller than one page, add more pages
    let heightLeft = imgHeight - pageHeight;
    let position = -pageHeight;
    
    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${fileName}.pdf`);
    toast.dismiss();
    toast.success('PDF generated successfully!');
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.dismiss();
    toast.error('Failed to generate PDF. Please try again.');
  }
}
