import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email, StatutProjet } from '@potentiel-domain/common';

import { ProjetEntity } from '../projet.entity';
import * as Technologie from '../typeTechnologie.valueType';

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
    contact: Email.RawType;
    adressePostale: string;
  };
  dateDésignation: DateTime.RawType;
  puissance: number;
  technologie: Technologie.RawType;

  isInvestissementParticipatif: boolean;
  isFinancementParticipatif: boolean;
  actionnariat?: string;
  evaluationCarbone: number;
  engagementFournitureDePuissanceAlaPointe: boolean;
  motifsElimination: string;
  prixReference: number;
};

/**
 * @deprecated
 */
export type ConsulterProjetQuery = Message<
  'Candidature.Query.ConsulterProjet',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterProjetReadModel>
>;

export type RécupérerProjetPort = (identifiantProjet: string) => Promise<Option.Type<ProjetEntity>>;

export type ConsulterProjetDependencies = {
  récupérerProjet: RécupérerProjetPort;
};

export const registerConsulterProjetQuery = ({ récupérerProjet }: ConsulterProjetDependencies) => {
  const handler: MessageHandler<ConsulterProjetQuery> = async ({ identifiantProjet }) => {
    const result = await récupérerProjet(identifiantProjet);

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
  engagementFournitureDePuissanceAlaPointe,
  evaluationCarbone,
  isInvestissementParticipatif,
  isFinancementParticipatif,
  motifsElimination,
  prixReference,
  actionnariat,
}: ProjetEntity): ConsulterProjetReadModel => {
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
    engagementFournitureDePuissanceAlaPointe,
    evaluationCarbone,
    isInvestissementParticipatif,
    isFinancementParticipatif,
    motifsElimination,
    prixReference,
    actionnariat,
  };
};
