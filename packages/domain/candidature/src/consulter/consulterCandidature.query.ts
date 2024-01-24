import { Message, MessageHandler, mediator } from 'mediateur';

import { Option, isNone } from '@potentiel/monads';

import { CandidatureProjection } from '../candidature.projection';
import { DateTime, StatutProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { CandidatureInconnueErreur } from '../candidatureInconnue.error';

import * as Technologie from '../technologie.valueType';

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
    adressePostale: string;
  };
  dateDésignation: DateTime.RawType;
  puissance: number;
  technologie: Technologie.TypeTechnologie;
};

export type ConsulterCandidatureQuery = Message<
  'CONSULTER_CANDIDATURE_QUERY',
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

export const registerConsulterCandidatureQuery = ({
  récupérerCandidature,
}: ConsulterCandidatureDependencies) => {
  const handler: MessageHandler<ConsulterCandidatureQuery> = async ({ identifiantProjet }) => {
    const result = await récupérerCandidature(identifiantProjet);

    if (isNone(result)) {
      throw new CandidatureInconnueErreur();
    }

    return mapToReadModel(result);
  };

  mediator.register('CONSULTER_CANDIDATURE_QUERY', handler);
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
  adressePostaleCandidat,
  technologie,
}: CandidatureProjection): ConsulterCandidatureReadModel => {
  return {
    appelOffre,
    candidat: {
      contact: email,
      nom: nomCandidat,
      représentantLégal: nomReprésentantLégal,
      adressePostale: adressePostaleCandidat,
    },
    dateDésignation,
    famille,
    localité,
    nom,
    numéroCRE,
    puissance,
    période,
    statut,
    technologie: Technologie.convertirEnValueType(technologie).formatter(),
  };
};
