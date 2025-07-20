import jsPDF from 'jspdf';

/**
 * Generates and downloads a PDF from the given data and base filename.
 * The filename will be appended with the current date and time for uniqueness.
 * @param data - The data to include in the PDF (object or string)
 * @param baseFileName - The base name for the PDF file
 */
export function downloadDataAsPdf(data: any, baseFileName: string): void {
  const doc = new jsPDF();
  const now = new Date();
  const dateStr = now.toISOString().replace(/[:.]/g, '-');
  const fileName = `${baseFileName}-${dateStr}.pdf`;
  const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  const lines = doc.splitTextToSize(text, 180);
  const lineHeight = 7; // px
  const marginTop = 10;
  const marginLeft = 10;
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = marginTop;
lines.forEach((line: string, i: number) => {
    if (y + lineHeight > pageHeight - marginTop) {
      doc.addPage();
      y = marginTop;
    }
    doc.text(line, marginLeft, y);
    y += lineHeight;
  });
  doc.save(fileName);
}
