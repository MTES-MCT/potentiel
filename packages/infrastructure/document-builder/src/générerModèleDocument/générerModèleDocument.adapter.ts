import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

import { GénérerModèleDocumentPort, OptionsGénération } from '@potentiel-domain/document';

// import { formatDatesFromDataToFrFormat } from '../formatDatesFromDataToFrFormat';
// import { formatIdentifiantProjetForDocument } from '../formatIdentifiantProjetForDocument';

export const générerModèleDocumentAdapter: GénérerModèleDocumentPort = async (options) => {
  const templateFilePath = getTemplateFilePath(options);

  const content = fs.readFileSync(path.resolve(__dirname, templateFilePath), 'binary');
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.render(options.data);

  const buf = doc.getZip().generate({
    type: 'nodebuffer',
    // compression: DEFLATE adds a compression step.
    // For a 50MB output document, expect 500ms additional CPU time
    compression: 'DEFLATE',
  });

  if (options.logo) {
    const logoFilePath = path.resolve(__dirname, '../../assets/images', `${options.logo}.png`);
    try {
      const imageContents = fs.readFileSync(logoFilePath, 'binary');
      zip.file('word/media/image1.png', imageContents, { binary: true });
    } catch (e) {}
  }

  return new ReadableStream({
    start: async (controller) => {
      controller.enqueue(buf);
      controller.close();
    },
  });
};

const getTemplateFilePath = ({ type, data }: OptionsGénération) => {
  switch (type) {
    case 'abandon':
      return data.aprèsConfirmation
        ? '../assets/docx/abandon-modèle-réponse-après-confirmation.docx'
        : '../assets/docx/abandon-modèle-réponse.docx';

    case 'mise-en-demeure':
      return '../assets/docx/garanties-financières-modèle-mise-en-demeure.docx';
  }
};
