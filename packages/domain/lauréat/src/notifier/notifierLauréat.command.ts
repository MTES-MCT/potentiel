import { Message, MessageHandler, mediator } from 'mediateur';

import { LoadAggregate } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { loadLauréatFactory } from '../lauréat.aggregate';

export type NotifierLauréatCommand = Message<
  'Lauréat.Command.NotifierLauréat',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateNotification: DateTime.ValueType;
  }
>;

export const registerNotifierLauréatCommand = (loadAggregate: LoadAggregate) => {
  const loadLauréatAggregate = loadLauréatFactory(loadAggregate);
  const handler: MessageHandler<NotifierLauréatCommand> = async (payload) => {
    const Lauréat = await loadLauréatAggregate(payload.identifiantProjet, false);
    await Lauréat.notifier(payload);
  };

  mediator.register('Lauréat.Command.NotifierLauréat', handler);
};
