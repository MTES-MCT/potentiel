import path from 'node:path';
import { Readable } from 'node:stream';

import ReactPDF, { Font } from '@react-pdf/renderer';

import { fontsFolderPath, imagesFolderPath } from '../assets.js';
import { SynthèseLauréatsPériode } from './SynthèseLauréatsPériode.js';

Font.register({
  family: 'Arimo',
  fonts: [
    {
      src: path.join(fontsFolderPath, '/arimo/Arimo-Regular.ttf'),
    },
    {
      src: path.join(fontsFolderPath, '/arimo/Arimo-Bold.ttf'),
      fontWeight: 'bold',
    },
    {
      src: path.join(fontsFolderPath, '/arimo/Arimo-Italic.ttf'),
      fontStyle: 'italic',
    },
  ],
});

export type GénérerSynthèseLauréatsPériodePort = (
  données: DonnéesDocument,
) => Promise<ReadableStream>;

export type DonnéesDocument = {
  dateCourrier: string;
  imagesFolderPath: string;
  période: {
    titre: string;
    cycleAppelOffres: string;
    unitéPuissance: string;
    titreAppelOffres: string;
    puissanceRecherchée: string;
  };
  synthèse: {
    candidats: { nombre: string; puissanceCumulée: string };
    lauréats: { nombre: string; puissanceCumulée: string; prixMoyenPondéré: string };
  };
  lauréats: {
    nom: string;
    nomProjet: string;
    puissance: string;
    commune: string;
    département: string;
    région: string;
  }[];
};

const buildDocument: GénérerSynthèseLauréatsPériodePort = async (
  props: DonnéesDocument,
): Promise<ReadableStream> => {
  const document = SynthèseLauréatsPériode({ ...props, imagesFolderPath });

  const buffer = await ReactPDF.renderToStream(document);
  return Readable.toWeb(Readable.from(buffer));
};

export type { buildDocument };
