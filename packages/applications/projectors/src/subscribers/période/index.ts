import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Période } from '@potentiel-domain/periode';

import { périodeNotifiéeProjector } from './périodeNotifiée.projector.js';
import { périodeRebuildTriggered } from './périodeRebuildTriggered.projector.js';

export type SubscriptionEvent = Période.PériodeNotifiéeEvent | RebuildTriggered;

export type Execute = Message<'System.Projector.Période', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, périodeRebuildTriggered)
      .with({ type: 'PériodeNotifiée-V1' }, périodeNotifiéeProjector)
      .exhaustive();

  mediator.register('System.Projector.Période', handler);
};
