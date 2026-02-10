import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port.js';
import { IdentifiantProjet } from '../../index.js';

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
