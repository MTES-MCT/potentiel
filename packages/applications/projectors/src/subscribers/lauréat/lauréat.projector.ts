import { Message, MessageHandler, mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/laureat';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Candidature } from '@potentiel-domain/candidature';

import { removeProjection } from '../../infrastructure/removeProjection';
import { upsertProjection } from '../../infrastructure/upsertProjection';

export type SubscriptionEvent = (Candidature.LauréatNotifié & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<Lauréat.LauréatEntity>(`lauréat|${payload.id}`);
    } else {
      const { identifiantProjet, dateNotification } = payload;

      switch (type) {
        case 'LauréatNotifié-V1':
          await upsertProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
            identifiantProjet,
            dateDésignation: dateNotification,
          });
          break;
      }
    }
  };

  mediator.register('System.Projector.Lauréat', handler);
};
