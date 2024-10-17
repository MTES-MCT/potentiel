import path from 'node:path';

import ReactPDF, { Font } from '@react-pdf/renderer';

import { mapToReadableStream } from '../../mapToReadableStream';
import { fontsFolderPath, imagesFolderPath } from '../../assets';

import { RéponseAbandonAvecRecandidature } from './RéponseAbandonAvecRecandidature';

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

export type GénérerRéponseAccordAbandonAvecRecandidaturePort = (
  données: DonnéesDocument,
) => Promise<ReadableStream>;

export type DonnéesDocument = {
  dateCourrier: string;
  projet: {
    identifiantProjet: string;
    nomReprésentantLégal: string;
    nomCandidat: string;
    email: string;
    nom: string;
    commune: string;
    codePostal: string;
    dateDésignation: string;
    puissance: number;
  };
  appelOffre: {
    nom: string;
    description: string;
    période: string;
    unitéPuissance: string;
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: string;
      dispositions: string;
    };
  };
  demandeAbandon: {
    date: string;
    instructeur: {
      nom: string;
      fonction: string;
    };
  };
};

const buildDocument: GénérerRéponseAccordAbandonAvecRecandidaturePort = async (
  props: DonnéesDocument,
): Promise<ReadableStream> => {
  const document = RéponseAbandonAvecRecandidature({ ...props, imagesFolderPath });

  return await mapToReadableStream(await ReactPDF.renderToStream(document));
};

export { buildDocument };
