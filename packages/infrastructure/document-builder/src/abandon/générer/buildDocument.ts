import ReactPDF, { Font } from '@react-pdf/renderer';
import dotenv from 'dotenv';
import {
  RéponseAbandonAvecRecandidature,
  RéponseAbandonAvecRecandidatureProps,
} from './RéponseAbandonAvecRecandidature';
import { mapToReadableStream } from '../../mapToReadableStream';

dotenv.config();

Font.register({
  family: 'Arimo',
  fonts: [
    {
      src: process.env.BASE_URL + '/fonts/arimo/Arimo-Regular.ttf',
    },
    {
      src: process.env.BASE_URL + '/fonts/arimo/Arimo-Bold.ttf',
      fontWeight: 'bold',
    },
    {
      src: process.env.BASE_URL + '/fonts/arimo/Arimo-Italic.ttf',
      fontStyle: 'italic',
    },
  ],
});

export type GénérerRéponseAccordAbandonAvecRecandidaturePort = (
  données: DonnéesDocument,
) => Promise<ReadableStream>;

type DonnéesDocument = {
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
  props: RéponseAbandonAvecRecandidatureProps,
): Promise<ReadableStream> => {
  const document = RéponseAbandonAvecRecandidature(props);

  return await mapToReadableStream(await ReactPDF.renderToStream(document));
};

export { buildDocument };
