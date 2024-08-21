import ReactPDF from '@react-pdf/renderer';

import { mapToReadableStream } from '../../mapToReadableStream';

import {
  RéponseAbandonAvecRecandidature,
  RéponseAbandonAvecRecandidatureProps,
} from './RéponseAbandonAvecRecandidature';

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
  props: RéponseAbandonAvecRecandidatureProps,
): Promise<ReadableStream> => {
  const document = RéponseAbandonAvecRecandidature(props);

  return await mapToReadableStream(await ReactPDF.renderToStream(document));
};

export { buildDocument };
