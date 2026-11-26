import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import type { Période } from '@potentiel-domain/periode';

import { handlePériodeImportée, handlePériodeNotifiée } from './handlers/index.js';

export type SubscriptionEvent = Période.PériodeEvent;

export type Execute = Message<'System.Notification.Période', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'PériodeNotifiée-V1' }, handlePériodeNotifiée)
      .with({ type: 'PériodeImportée-V1' }, handlePériodeImportée)
      .with({ type: 'ImportPériodeInitié-V1' }, () => Promise.resolve())
      .exhaustive();

  mediator.register('System.Notification.Période', handler);
};
