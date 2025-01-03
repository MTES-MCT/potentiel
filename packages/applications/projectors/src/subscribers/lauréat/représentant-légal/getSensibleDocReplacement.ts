import { PDFDocument, StandardFonts } from 'pdf-lib';

export const getSensibleDocReplacement = async (text: string) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const textSize = 24;

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const textWidth = helveticaFont.widthOfTextAtSize(text, textSize);
  const textHeight = helveticaFont.heightAtSize(textSize);

  page.drawText(text, {
    x: page.getWidth() / 2 - textWidth / 2,
    y: page.getHeight() / 2 - textHeight / 2,
    size: textSize,
    font: helveticaFont,
  });

  const pdfBytes = await pdfDoc.save();

  return new Blob([pdfBytes], { type: 'application/pdf' }).stream();
};
