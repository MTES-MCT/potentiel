import fs from 'fs';
import path from 'path';

import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

import { assets } from '../assets';

import {
  ModèleRéponseAbandon,
  modèleRéponseAbandonFileName,
} from './abandon/modèleRéponseSignéeAbandon';
import {
  ModèleRéponseRecours,
  modèleRéponseRecoursFileName,
} from './recours/modèleRéponseSignéeRecours';
import {
  ModèleRéponseMainlevée,
  modèleRéponseMainlevéeFileName,
} from './garantiesFinancières/modèleRéponseSignéeMainlevée';
import {
  ModèleMiseEnDemeure,
  modèleRéponseMiseEnDemeureFileName,
} from './garantiesFinancières/modèleRéponseSignéeMiseEnDemeure';

export type GénérerModèleRéponseOptions = { logo?: string } & (
  | ModèleRéponseAbandon
  | ModèleRéponseRecours
  | ModèleMiseEnDemeure
  | ModèleRéponseMainlevée
);

export type GénérerModèleRéponsePort = (
  options: GénérerModèleRéponseOptions,
) => Promise<ReadableStream>;

export const générerModèleRéponseAdapter: GénérerModèleRéponsePort = async ({
  type,
  logo,
  data,
}) => {
  const templateFilePath = getModèleRéponseFilePath(type);

  const content = fs.readFileSync(templateFilePath, 'binary');
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.render(data);

  if (logo) {
    const logoFilePath = path.resolve(assets.imagesFolderPath, `${logo}.png`);
    try {
      const imageContents = fs.readFileSync(logoFilePath, 'binary');
      zip.file('word/media/image1.png', imageContents, { binary: true });
    } catch (e) {}
  }

  const buf = doc.getZip().generate({
    type: 'nodebuffer',
    // compression: DEFLATE adds a compression step.
    // For a 50MB output document, expect 500ms additional CPU time
    compression: 'DEFLATE',
  });

  return new ReadableStream({
    start: async (controller) => {
      controller.enqueue(buf);
      controller.close();
    },
  });
};

const getModèleRéponseFilePath = (type: GénérerModèleRéponseOptions['type']) => {
  switch (type) {
    case 'abandon':
      return path.resolve(assets.docxFolderPath, modèleRéponseAbandonFileName);
    case 'recours':
      return path.resolve(assets.docxFolderPath, modèleRéponseRecoursFileName);
    case 'mainlevée':
      return path.resolve(assets.docxFolderPath, modèleRéponseMainlevéeFileName);
    case 'mise-en-demeure':
      return path.resolve(assets.docxFolderPath, modèleRéponseMiseEnDemeureFileName);
  }
};
