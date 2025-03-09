
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

    // Create a clone of the element to avoid modifying the original
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.transform = 'none';
    document.body.appendChild(clone);
    
    // Temporarily make the clone visible for rendering
    const originalPosition = clone.style.position;
    const originalLeft = clone.style.left;
    const originalTop = clone.style.top;
    
    clone.style.position = 'fixed';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    
    // Ensure the clone has proper dimensions for PDF (A4)
    clone.style.width = '210mm';
    clone.style.height = 'auto';
    
    // Render the element to canvas
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    // Clean up the clone
    clone.style.position = originalPosition;
    clone.style.left = originalLeft;
    clone.style.top = originalTop;
    document.body.removeChild(clone);
    
    // Get image data and create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // A4 dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    
    // Calculate image height proportionally
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add the image to the PDF
    let position = 0;
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    
    // If the content is taller than one page, add more pages
    let heightLeft = imgHeight - pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Save the PDF
    pdf.save(`${fileName}.pdf`);
    
    toast.dismiss();
    toast.success('PDF generated successfully!');
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.dismiss();
    toast.error('Failed to generate PDF. Please try again.');
  }
}
