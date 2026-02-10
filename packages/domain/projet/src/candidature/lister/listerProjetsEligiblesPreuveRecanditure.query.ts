import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../index.js';

export type ListerProjetsEligiblesPreuveRecanditureReadModel = Array<{
  identifiantProjet: IdentifiantProjet.ValueType;
  nom: string;
  dateDésignation: DateTime.ValueType;
}>;

export type RécupérerProjetsEligiblesPreuveRecanditurePort = (
  identifiantUtilisateur: string,
) => Promise<ListerProjetsEligiblesPreuveRecanditureReadModel>;

export type ListerProjetsEligiblesPreuveRecanditureDependencies = {
  récupérerProjetsEligiblesPreuveRecanditure: RécupérerProjetsEligiblesPreuveRecanditurePort;
};

export type ListerProjetsEligiblesPreuveRecanditureQuery = Message<
  'Candidature.Query.ListerProjetsEligiblesPreuveRecandidature',
  {
    identifiantUtilisateur: string;
  },
  ListerProjetsEligiblesPreuveRecanditureReadModel
>;

export const registerProjetsEligiblesPreuveRecanditureQuery = ({
  récupérerProjetsEligiblesPreuveRecanditure,
}: ListerProjetsEligiblesPreuveRecanditureDependencies) => {
  const handler: MessageHandler<ListerProjetsEligiblesPreuveRecanditureQuery> = async ({
    identifiantUtilisateur,
  }) => {
    return récupérerProjetsEligiblesPreuveRecanditure(identifiantUtilisateur);
  };

  mediator.register('Candidature.Query.ListerProjetsEligiblesPreuveRecandidature', handler);
};
