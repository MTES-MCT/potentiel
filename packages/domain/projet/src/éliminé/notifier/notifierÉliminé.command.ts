import { Message, MessageHandler, mediator } from 'mediateur';

import { LoadAggregate } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet, ProjetAggregateRoot } from '../..';

export type NotifierÉliminéCommand = Message<
  'Éliminé.Command.NotifierÉliminé',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    notifiéLe: DateTime.ValueType;
    notifiéPar: Email.ValueType;
    attestation: { format: string };
  }
>;

export const registerNotifierÉliminéCommand = (loadAggregate: LoadAggregate) => {
  const handler: MessageHandler<NotifierÉliminéCommand> = async ({
    attestation,
    identifiantProjet,
    notifiéLe,
    notifiéPar,
  }) => {
    const projet = await ProjetAggregateRoot.get(identifiantProjet, loadAggregate);

    return projet.éliminé.notifier({
      attestation,
      notifiéLe,
      notifiéPar,
    });
  };

  mediator.register('Éliminé.Command.NotifierÉliminé', handler);
};
