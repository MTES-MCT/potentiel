import fs from 'fs';
import path from 'path';

import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { match } from 'ts-pattern';

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
import {
  ModèleRéponseActionnaire,
  modèleRéponseActionnaireFileName,
} from './actionnaire/modèleRéponseSignéeActionnaire';

export type GénérerModèleRéponseOptions = { logo?: string } & (
  | ModèleRéponseAbandon
  | ModèleRéponseRecours
  | ModèleMiseEnDemeure
  | ModèleRéponseMainlevée
  | ModèleRéponseActionnaire
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
  return match(type)
    .with('abandon', () => path.resolve(assets.docxFolderPath, modèleRéponseAbandonFileName))
    .with('recours', () => path.resolve(assets.docxFolderPath, modèleRéponseRecoursFileName))
    .with('mainlevée', () => path.resolve(assets.docxFolderPath, modèleRéponseMainlevéeFileName))
    .with('mise-en-demeure', () =>
      path.resolve(assets.docxFolderPath, modèleRéponseMiseEnDemeureFileName),
    )
    .with('actionnaire', () =>
      path.resolve(assets.docxFolderPath, modèleRéponseActionnaireFileName),
    )
    .exhaustive();
};
