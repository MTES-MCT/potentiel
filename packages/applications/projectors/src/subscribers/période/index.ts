import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import type { Période } from '@potentiel-domain/periode';
import type { Event, RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { périodeNotifiéeProjector } from './périodeNotifiée.projector';
import { périodeRebuildTriggered } from './périodeRebuildTriggered.projector';

export type SubscriptionEvent = (Période.PériodeNotifiéeEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Periode', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, périodeRebuildTriggered)
      .with({ type: 'PériodeNotifiée-V1' }, périodeNotifiéeProjector)
      .exhaustive();

  mediator.register('System.Projector.Periode', handler);
};
