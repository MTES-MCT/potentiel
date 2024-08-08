import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, StatutProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { CandidatureEntity } from '../candidature.entity';
import * as Technologie from '../technologie.valueType';

export type ConsulterProjetReadModel = {
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

export type ConsulterProjetQuery = Message<
  'Candidature.Query.ConsulterProjet',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterProjetReadModel>
>;

export type RécupérerCandidaturePort = (
  identifiantProjet: string,
) => Promise<Option.Type<CandidatureEntity>>;

export type ConsulterProjetDependencies = {
  récupérerCandidature: RécupérerCandidaturePort;
};

export const registerConsulterProjetQuery = ({
  récupérerCandidature,
}: ConsulterProjetDependencies) => {
  const handler: MessageHandler<ConsulterProjetQuery> = async ({ identifiantProjet }) => {
    const result = await récupérerCandidature(identifiantProjet);

    if (Option.isNone(result)) {
      return result;
    }

    return mapToReadModel(result);
  };

  mediator.register('Candidature.Query.ConsulterProjet', handler);
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
}: CandidatureEntity): ConsulterProjetReadModel => {
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
