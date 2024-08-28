import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadPériodeFactory } from '../période.aggregate';
import * as IdentifiantPériode from '../identifiantPériode.valueType';

export type NotifierPériodeCommand = Message<
  'Période.Command.NotifierPériode',
  {
    identifiantPériode: IdentifiantPériode.ValueType;
    candidats: ReadonlyArray<IdentifiantProjet.ValueType>;
  }
>;

export const registerNotifierPériodeCommand = (loadAggregate: LoadAggregate) => {
  const loadPériode = loadPériodeFactory(loadAggregate);

  const handler: MessageHandler<NotifierPériodeCommand> = async ({ identifiantPériode }) => {
    const lauréats: ReadonlyArray<IdentifiantProjet.ValueType> = [];
    const éliminés: ReadonlyArray<IdentifiantProjet.ValueType> = [];

    const période = await loadPériode(identifiantPériode, false);

    await période.notifier({ identifiantPériode, lauréats, éliminés });
  };

  mediator.register('Période.Command.NotifierPériode', handler);
};
