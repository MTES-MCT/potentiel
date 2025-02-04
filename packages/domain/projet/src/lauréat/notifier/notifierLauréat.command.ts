import { Message, MessageHandler, mediator } from 'mediateur';

import { LoadAggregate } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet, ProjetAggregateRoot } from '../..';

export type NotifierLauréatCommand = Message<
  'Lauréat.Command.NotifierLauréat',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    notifiéLe: DateTime.ValueType;
    notifiéPar: Email.ValueType;
    attestation: { format: string };
  }
>;

export const registerNotifierLauréatCommand = (loadAggregate: LoadAggregate) => {
  const handler: MessageHandler<NotifierLauréatCommand> = async ({
    identifiantProjet,
    attestation,
    notifiéLe,
    notifiéPar,
  }) => {
    const projet = await ProjetAggregateRoot.get(identifiantProjet, loadAggregate);

    await projet.lauréat.notifier({
      attestation,
      notifiéLe,
      notifiéPar,
    });
  };
  mediator.register('Lauréat.Command.NotifierLauréat', handler);
};
