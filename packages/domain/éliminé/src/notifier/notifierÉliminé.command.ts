import { Message, MessageHandler, mediator } from 'mediateur';

import { LoadAggregate } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { loadÉliminéFactory } from '../éliminé.aggregate';

export type NotifierÉliminéCommand = Message<
  'Éliminé.Command.NotifierÉliminé',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateNotification: DateTime.ValueType;
  }
>;

export const registerNotifierÉliminéCommand = (loadAggregate: LoadAggregate) => {
  const loadÉliminéAggregate = loadÉliminéFactory(loadAggregate);
  const handler: MessageHandler<NotifierÉliminéCommand> = async (payload) => {
    const Éliminé = await loadÉliminéAggregate(payload.identifiantProjet, false);
    await Éliminé.notifier(payload);
  };

  mediator.register('Éliminé.Command.NotifierÉliminé', handler);
};
