import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Période } from '@potentiel-domain/periode';

import { périodeNotifiéeProjector } from './périodeNotifiée.projector';
import { périodeRebuildTriggered } from './périodeRebuildTriggered.projector';

export type SubscriptionEvent = (Période.PériodeNotifiéeEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Periode', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, périodeRebuildTriggered)
      .with({ type: 'PériodeNotifiée-V1' }, périodeNotifiéeProjector)
      .exhaustive();

  mediator.register('System.Projector.Periode', handler);
};
