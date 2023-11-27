import { Message, MessageHandler, mediator } from 'mediateur';

import { CandidatureProjection } from '../candidature.projection';
import { DateTime, IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';

export type ListerCandidaturesNotifiéesEtNonAbandonnéesParPorteurReadModel = Array<{
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutProjet.ValueType;
  nom: string;
  dateDésignation: DateTime.RawType;
}>;

export type RécupérerCandidaturesNotifiéesEtNonAbandonnéesParPorteurPort = (
  identifiantUtilisateur: string,
) => Promise<ReadonlyArray<CandidatureProjection>>;

export type ListerCandidaturesNotifiéesEtNonAbandonnéesParPorteurDependencies = {
  récupérerCandidaturesNotifiéesEtNonAbandonnéesParPorteur: RécupérerCandidaturesNotifiéesEtNonAbandonnéesParPorteurPort;
};

export type ListerCandidaturesNotifiéesEtNonAbandonnéesParPorteurQuery = Message<
  'LISTER_CANDIDATURES_NOTIFIÉES_ET_NON_ABANDONNÉES_PAR_PORTEUR_QUERY',
  {
    identifiantUtilisateur: string;
  },
  ListerCandidaturesNotifiéesEtNonAbandonnéesParPorteurReadModel
>;

export const registerListerCandidaturesNotifiéesEtNonAbandonnéesParPorteurQuery = ({
  récupérerCandidaturesNotifiéesEtNonAbandonnéesParPorteur,
}: ListerCandidaturesNotifiéesEtNonAbandonnéesParPorteurDependencies) => {
  const handler: MessageHandler<
    ListerCandidaturesNotifiéesEtNonAbandonnéesParPorteurQuery
  > = async ({ identifiantUtilisateur }) => {
    const result = await récupérerCandidaturesNotifiéesEtNonAbandonnéesParPorteur(
      identifiantUtilisateur,
    );

    return result.map(mapToReadModel);
  };

  mediator.register('LISTER_CANDIDATURES_NOTIFIÉES_ET_NON_ABANDONNÉES_PAR_PORTEUR_QUERY', handler);
};

const mapToReadModel = ({
  appelOffre,
  famille,
  nom,
  numéroCRE,
  période,
  statut,
  dateDésignation,
}: CandidatureProjection): ListerCandidaturesNotifiéesEtNonAbandonnéesParPorteurReadModel[number] => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(
      `${appelOffre}#${période}#${famille}#${numéroCRE}`,
    ),
    nom,
    statut: StatutProjet.convertirEnValueType(statut),
    dateDésignation,
  };
};
