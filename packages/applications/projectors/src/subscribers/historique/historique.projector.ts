import { Message, MessageHandler, mediator } from 'mediateur';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  createHistoryProjection,
  removeHistoryProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Abandon, Actionnaire } from '@potentiel-domain/laureat';
import { Recours } from '@potentiel-domain/elimine';

export type SubscriptionEvent =
  | (Abandon.AbandonEvent & Event)
  | (Recours.RecoursEvent & Event)
  | (Actionnaire.ActionnaireEvent & Event)
  | RebuildTriggered;

export type Execute = Message<'System.Projector.Historique', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async ({ created_at, payload, stream_id, type }) => {
    if (type === 'RebuildTriggered') {
      const { category, id } = payload;
      await removeHistoryProjection(category, id);
    } else {
      const [category, id] = stream_id.split('|');
      await createHistoryProjection({
        category,
        id,
        createdAt: created_at,
        payload,
        type,
      });
    }
  };

  mediator.register('System.Projector.Historique', handler);
};
