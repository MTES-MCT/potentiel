import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';

import { CandidatureEntity } from '../candidature.entity';

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
) => Promise<ReadonlyArray<CandidatureEntity>>;

export type ListerCandidaturesEligiblesPreuveRecanditureDependencies = {
  récupérerCandidaturesEligiblesPreuveRecanditure: RécupérerCandidaturesEligiblesPreuveRecanditurePort;
};

export type ListerCandidaturesEligiblesPreuveRecanditureQuery = Message<
  'Candidature.Query.ListerCandidaturesEligiblesPreuveRecandidature',
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

  mediator.register('Candidature.Query.ListerCandidaturesEligiblesPreuveRecandidature', handler);
};

const mapToReadModel = ({
  appelOffre,
  famille,
  nom,
  numéroCRE,
  période,
  statut,
  dateDésignation,
}: CandidatureEntity): ListerCandidaturesEligiblesPreuveRecanditureReadModel[number] => ({
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
