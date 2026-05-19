import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port.js';
import type { IdentifiantProjet } from '../../index.js';

export type NotifierLauréatCommand = Message<
  'Lauréat.Command.NotifierLauréat',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    notifiéLe: DateTime.ValueType;
    notifiéPar: Email.ValueType;
    attestation: { format: string };
  }
>;

export const registerNotifierLauréatCommand = (getProjetAggregateRoot: GetProjetAggregateRoot) => {
  const handler: MessageHandler<NotifierLauréatCommand> = async ({
    attestation,
    identifiantProjet,
    notifiéLe,
    notifiéPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.notifier({
      attestation: { format: attestation.format },
      notifiéLe,
      notifiéPar,
    });
  };

  mediator.register('Lauréat.Command.NotifierLauréat', handler);
};
