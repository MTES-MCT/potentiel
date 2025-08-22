import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import type { DateTime, Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../..';

export type NotifierCandidatureCommand = Message<
  'Candidature.Command.NotifierCandidature',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
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
    const projet = await getProjetAggregateRoot(identifiantProjet);
    await projet.candidature.notifier(options);
  };

  mediator.register('Candidature.Command.NotifierCandidature', handler);
};
