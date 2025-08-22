import fs from 'node:fs';
import path from 'node:path';

import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

import { assets } from '../assets';
import {
  type ModèleRéponseAbandon,
  modèleRéponseAbandonFileName,
} from './abandon/modèleRéponseSignéeAbandon';
import {
  type ModèleRéponseActionnaire,
  modèleRéponseActionnaireFileName,
} from './actionnaire/modèleRéponseSignéeActionnaire';
import {
  type ModèleRéponseDélai,
  modèleRéponseDélaiFileName,
} from './délai/modèleRéponseSignéeDélai';
import {
  type ModèleRéponseMainlevée,
  modèleRéponseMainlevéeFileName,
} from './garantiesFinancières/modèleRéponseSignéeMainlevée';
import {
  type ModèleMiseEnDemeure,
  modèleRéponseMiseEnDemeureFileName,
} from './garantiesFinancières/modèleRéponseSignéeMiseEnDemeure';
import {
  type ModèleRéponsePuissance,
  modèleRéponsePuissanceFileName,
} from './puissance/modèleRéponseSignéePuissance';
import {
  type ModèleRéponseRecours,
  modèleRéponseRecoursFileName,
} from './recours/modèleRéponseSignéeRecours';

export type GénérerModèleRéponseOptions = { logo?: string } & (
  | ModèleRéponseAbandon
  | ModèleRéponseRecours
  | ModèleMiseEnDemeure
  | ModèleRéponseMainlevée
  | ModèleRéponseActionnaire
  | ModèleRéponsePuissance
  | ModèleRéponseDélai
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
    } catch {}
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
  const modèles: Record<GénérerModèleRéponseOptions['type'], string> = {
    abandon: modèleRéponseAbandonFileName,
    recours: modèleRéponseRecoursFileName,
    mainlevée: modèleRéponseMainlevéeFileName,
    'mise-en-demeure': modèleRéponseMiseEnDemeureFileName,
    actionnaire: modèleRéponseActionnaireFileName,
    puissance: modèleRéponsePuissanceFileName,
    délai: modèleRéponseDélaiFileName,
  };
  if (!modèles[type]) {
    throw new Error(`Modèle Inconnu : ${type}`);
  }
  return path.resolve(assets.docxFolderPath, modèles[type]);
};
