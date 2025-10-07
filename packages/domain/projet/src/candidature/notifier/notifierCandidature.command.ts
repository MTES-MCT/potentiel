import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../..';
import { StatutCandidature } from '..';

export type NotifierCandidatureCommand = Message<
  'Candidature.Command.NotifierCandidature',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    statut: StatutCandidature.ValueType;
    notifiéeLe: DateTime.ValueType;
    notifiéePar: Email.ValueType;
    validateur: AppelOffre.Validateur;
    attestation: { format: string };
  }
>;

export const registerNotifierCandidatureCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<NotifierCandidatureCommand> = async ({
    identifiantProjet,
    ...options
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet, true);
    await projet.candidature.notifier(options);
  };

  mediator.register('Candidature.Command.NotifierCandidature', handler);
};
