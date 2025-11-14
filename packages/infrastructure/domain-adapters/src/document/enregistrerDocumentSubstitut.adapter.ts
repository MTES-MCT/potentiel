import { PDFDocument, StandardFonts } from 'pdf-lib';

import { Document } from '@potentiel-domain/projet';
import { upload } from '@potentiel-libraries/file-storage';

export const enregistrerDocumentSubstitutAdapter: Document.EnregistrerDocumentSubstitutPort =
  async (documentProjet, raison) => {
    await upload(documentProjet.formatter(), await buildCenteredTextPdfFile(raison));
  };

const buildCenteredTextPdfFile = async (text: string) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const textSize = 20;
  const lineHeight = textSize * 1.2;
  const marginX = 50;
  const marginTop = 200;

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Split text into words and create lines that fit within the page width
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = helveticaFont.widthOfTextAtSize(testLine, textSize);

    if (testWidth <= page.getWidth() - 2 * marginX) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        lines.push(word); // Single word is too long, add it anyway
      }
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  // Start drawing from the top with margin
  const startY = page.getHeight() - marginTop;

  lines.forEach((line, index) => {
    const textWidth = helveticaFont.widthOfTextAtSize(line, textSize);
    const x = page.getWidth() / 2 - textWidth / 2;
    const y = startY - index * lineHeight;

    page.drawText(line, {
      x: Math.max(marginX, x),
      y,
      size: textSize,
      font: helveticaFont,
    });
  });

  const pdfBytes = await pdfDoc.save();

  return new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' }).stream();
};
