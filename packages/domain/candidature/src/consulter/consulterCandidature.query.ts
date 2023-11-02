import { Message, MessageHandler, mediator } from 'mediateur';

import { Option, isNone } from '@potentiel/monads';

import { CandidatureProjection } from '../candidature.projection';
import { DateTime, IdentifiantUtilisateur, StatutProjet } from '@potentiel-domain/common';
import { CandidatureInconnueErreur } from '../candidatureInconnue.error';

export type ConsulterCandidatureReadModel = {
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  statut: StatutProjet.RawType;
  nom: string;
  localité: {
    commune: string;
    département: string;
    région: string;
    codePostal: string;
  };
  candidat: {
    nom: string;
    représentantLégal: string;
    contact: IdentifiantUtilisateur.RawType;
  };
  dateDésignation: DateTime.RawType;
  puissance: number;
};

export type ConsulterCandidatureQuery = Message<
  'CONSULTER_CANDIDATURE',
  {
    identifiantProjet: string;
  },
  ConsulterCandidatureReadModel
>;

export type RécupérerCandidaturePort = (
  identifiantProjet: string,
) => Promise<Option<CandidatureProjection>>;

export type ConsulterCandidatureDependencies = {
  récupérerCandidature: RécupérerCandidaturePort;
};

export const registerConsulterDocumentProjetQuery = ({
  récupérerCandidature,
}: ConsulterCandidatureDependencies) => {
  const handler: MessageHandler<ConsulterCandidatureQuery> = async ({ identifiantProjet }) => {
    const result = await récupérerCandidature(identifiantProjet);

    if (isNone(result)) {
      throw new CandidatureInconnueErreur();
    }

    return mapToReadModel(result);
  };

  mediator.register('CONSULTER_CANDIDATURE', handler);
};

const mapToReadModel = ({
  appelOffre,
  dateDésignation,
  email,
  famille,
  localité,
  nom,
  nomCandidat,
  nomReprésentantLégal,
  numéroCRE,
  puissance,
  période,
  statut,
}: CandidatureProjection): ConsulterCandidatureReadModel => {
  return {
    appelOffre,
    candidat: {
      contact: email,
      nom: nomCandidat,
      représentantLégal: nomReprésentantLégal,
    },
    dateDésignation,
    famille,
    localité,
    nom,
    numéroCRE,
    puissance,
    période,
    statut,
  };
};
