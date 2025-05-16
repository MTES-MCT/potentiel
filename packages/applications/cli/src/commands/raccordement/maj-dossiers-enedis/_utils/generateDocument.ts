import { PDFDocument, StandardFonts } from 'pdf-lib';

export const generateDocument = async (text: string) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const textSize = 24;

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
  const textHeight = helveticaFont.heightAtSize(textSize);

  const x = page.getWidth() / 2 - textWidth / 2;

  page.drawText(text, {
    x: x > 0 ? x : 0,
    y: page.getHeight() / 2 - textHeight / 2,
    size: textSize,
    font: helveticaFont,
    maxWidth: page.getWidth(),
  });

  const pdfBytes = await pdfDoc.save();

  return {
    format: 'application/pdf',
    content: new Blob([pdfBytes], { type: 'application/pdf' }).stream(),
  };
};
