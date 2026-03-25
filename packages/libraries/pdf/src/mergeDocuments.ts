import { PDFDocument } from 'pdf-lib';

export const mergeDocuments = async (documents: Array<Blob>): Promise<Blob> => {
  const pdfDoc = await PDFDocument.create();

  for (const document of documents) {
    const pdfBytes = await document.arrayBuffer();
    const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

    if (pdf.isEncrypted) {
      throw new Error(`Impossible de fusionner des PDF chiffrés`);
    }

    const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());

    copiedPages.forEach((page) => {
      pdfDoc.addPage(page);
    });
  }

  const combinedPdfBytes = await pdfDoc.save();

  return new Blob([new Uint8Array(combinedPdfBytes)], { type: 'application/pdf' });
};
