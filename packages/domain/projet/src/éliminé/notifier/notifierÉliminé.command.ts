import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { IdentifiantProjet } from '../..';
import type { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';

export type NotifierÉliminéCommand = Message<
  'Éliminé.Command.NotifierÉliminé',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    notifiéLe: DateTime.ValueType;
    notifiéPar: Email.ValueType;
    attestation: { format: string };
  }
>;

export const registerNotifierÉliminéCommand = (getProjetAggregateRoot: GetProjetAggregateRoot) => {
  const handler: MessageHandler<NotifierÉliminéCommand> = async ({
    attestation,
    identifiantProjet,
    notifiéLe,
    notifiéPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.éliminé.notifier({
      attestation,
      notifiéLe,
      notifiéPar,
    });
  };

  mediator.register('Éliminé.Command.NotifierÉliminé', handler);
};
