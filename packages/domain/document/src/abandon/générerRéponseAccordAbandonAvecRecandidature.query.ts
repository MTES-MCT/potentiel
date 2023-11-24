import { Message, MessageHandler, mediator } from 'mediateur';
import { contentType } from 'mime-types';

export type GénérerRéponseAccordAbandonAvecRecandidatureReadModel = {
  content: ReadableStream;
  format: string;
};

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

export type GénérerRéponseAccordAbandonAvecRecandidatureQuery = Message<
  'GENERER_REPONSE_ACCORD_ABANDON_AVEC_RECANDIDATURE_QUERY',
  DonnéesDocument,
  GénérerRéponseAccordAbandonAvecRecandidatureReadModel
>;

export type GénérerRéponseAccordAbandonAvecRecandidaturePort = (
  données: DonnéesDocument,
) => Promise<ReadableStream>;

export type GénérerRéponseAccordAbandonAvecRecandidatureDependencies = {
  générerRéponseAccordAbandonAvecRecandidature: GénérerRéponseAccordAbandonAvecRecandidaturePort;
};

export const registerGénérerRéponseAccordAbandonAvecRecandidatureQuery = ({
  générerRéponseAccordAbandonAvecRecandidature,
}: GénérerRéponseAccordAbandonAvecRecandidatureDependencies) => {
  const handler: MessageHandler<GénérerRéponseAccordAbandonAvecRecandidatureQuery> = async (
    données,
  ) => {
    const content = await générerRéponseAccordAbandonAvecRecandidature(données);
    const format = contentType('pdf') as string;

    return {
      content,
      format,
    };
  };

  mediator.register('GENERER_REPONSE_ACCORD_ABANDON_AVEC_RECANDIDATURE_QUERY', handler);
};
