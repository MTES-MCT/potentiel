import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';

import { CandidatureEntity } from '../candidature.entity';
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
    adresse: string;
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
  'Candidature.Query.ConsulterCandidature',
  {
    identifiantProjet: string;
  },
  ConsulterCandidatureReadModel
>;

export type RécupérerCandidaturePort = (
  identifiantProjet: string,
) => Promise<Option.Type<CandidatureEntity>>;

export type ConsulterCandidatureDependencies = {
  récupérerCandidature: RécupérerCandidaturePort;
};

export const registerConsulterCandidatureQuery = ({
  récupérerCandidature,
}: ConsulterCandidatureDependencies) => {
  const handler: MessageHandler<ConsulterCandidatureQuery> = async ({ identifiantProjet }) => {
    const result = await récupérerCandidature(identifiantProjet);

    if (Option.isNone(result)) {
      throw new CandidatureInconnueErreur();
    }

    return mapToReadModel(result);
  };

  mediator.register('Candidature.Query.ConsulterCandidature', handler);
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
}: CandidatureEntity): ConsulterCandidatureReadModel => {
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
    technologie: Technologie.convertirEnValueType(technologie ?? 'N/A').formatter(),
  };
};
