import { Message, MessageHandler, mediator } from 'mediateur';

import { CandidatureProjection } from '../candidature.projection';
import { DateTime, IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';

export type ListerCandidaturesEligiblesPreuveRecanditureReadModel = Array<{
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  statut: StatutProjet.ValueType;
  nom: string;
  dateDésignation: DateTime.RawType;
}>;

export type RécupérerCandidaturesEligiblesPreuveRecanditurePort = (
  identifiantUtilisateur: string,
) => Promise<ReadonlyArray<CandidatureProjection>>;

export type ListerCandidaturesEligiblesPreuveRecanditureDependencies = {
  récupérerCandidaturesEligiblesPreuveRecanditure: RécupérerCandidaturesEligiblesPreuveRecanditurePort;
};

export type ListerCandidaturesEligiblesPreuveRecanditureQuery = Message<
  'LISTER_CANDIDATURES_ELIGIBLES_PREUVE_RECANDIDATURE_QUERY',
  {
    identifiantUtilisateur: string;
  },
  ListerCandidaturesEligiblesPreuveRecanditureReadModel
>;

export const registerCandidaturesEligiblesPreuveRecanditureQuery = ({
  récupérerCandidaturesEligiblesPreuveRecanditure,
}: ListerCandidaturesEligiblesPreuveRecanditureDependencies) => {
  const handler: MessageHandler<ListerCandidaturesEligiblesPreuveRecanditureQuery> = async ({
    identifiantUtilisateur,
  }) => {
    const result = await récupérerCandidaturesEligiblesPreuveRecanditure(identifiantUtilisateur);

    return result.map(mapToReadModel);
  };

  mediator.register('LISTER_CANDIDATURES_ELIGIBLES_PREUVE_RECANDIDATURE_QUERY', handler);
};

const mapToReadModel = ({
  appelOffre,
  famille,
  nom,
  numéroCRE,
  période,
  statut,
  dateDésignation,
}: CandidatureProjection): ListerCandidaturesEligiblesPreuveRecanditureReadModel[number] => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(
    `${appelOffre}#${période}#${famille}#${numéroCRE}`,
  ),
  appelOffre,
  période,
  famille,
  numéroCRE,
  nom,
  statut: StatutProjet.convertirEnValueType(statut),
  dateDésignation,
});
