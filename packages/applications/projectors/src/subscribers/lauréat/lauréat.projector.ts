import { Message, MessageHandler, mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/laureat';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { removeProjection } from '../../infrastructure/removeProjection';
import { upsertProjection } from '../../infrastructure/upsertProjection';

export type SubscriptionEvent = (Lauréat.LauréatEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<Lauréat.LauréatEntity>(`lauréat|${payload.id}`);
    } else {
      const { identifiantProjet, notifiéLe, notifiéPar } = payload;

      switch (type) {
        case 'LauréatNotifié-V1':
          await upsertProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
            identifiantProjet,
            notifiéLe,
            notifiéPar,
          });
          break;
      }
    }
  };

  mediator.register('System.Projector.Lauréat', handler);
};
