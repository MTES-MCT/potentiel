import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import type { NotificationApplication } from '@potentiel-domain/notifications-application';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { notificationApplicationAjoutéeProjector } from './notificationApplicationAjoutée.projector.js';
import { notificationApplicationRebuildTriggeredProjector } from './notificationApplicationRebuildTriggered.projector.js';

export type SubscriptionEvent =
  | NotificationApplication.NotificationApplicationEvent
  | RebuildTriggered;

export type Execute = Message<'System.Projector.NotificationApplication', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, notificationApplicationRebuildTriggeredProjector)
      .with({ type: 'NotificationApplicationAjoutée-V1' }, notificationApplicationAjoutéeProjector)
      .exhaustive();

  mediator.register('System.Projector.NotificationApplication', handler);
};
