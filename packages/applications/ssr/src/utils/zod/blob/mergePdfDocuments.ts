import { PDFDocument } from 'pdf-lib';

export const mergePdfDocuments = async (documents: Array<Blob>): Promise<Blob> => {
  const pdfDoc = await PDFDocument.create();

  for (const document of documents) {
    const pdfBytes = await document.arrayBuffer();
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());

    copiedPages.forEach((page) => {
      pdfDoc.addPage(page);
    });
  }

  const combinedPdfBytes = await pdfDoc.save();

  return new Blob([combinedPdfBytes], { type: 'application/pdf' });
};
