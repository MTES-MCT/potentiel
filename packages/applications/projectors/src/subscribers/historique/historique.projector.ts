import { Message, MessageHandler, mediator } from 'mediateur';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Abandon } from '@potentiel-domain/laureat';

import { createHistoryProjection } from '../../infrastructure/createHistoryProjection';

export type SubscriptionEvent = (Abandon.AbandonEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Historique', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async ({ created_at, payload, stream_id, type }) => {
    if (type === 'RebuildTriggered') {
      return;
    }

    const [category, id] = stream_id.split('|');
    await createHistoryProjection({
      category,
      id,
      createdAt: created_at,
      payload,
      type,
    });
  };

  mediator.register('System.Projector.Historique', handler);
};
