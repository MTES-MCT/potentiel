import { Message, MessageHandler, mediator } from 'mediateur';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Période } from '@potentiel-domain/periode';

import { removeProjection } from '../../infrastructure/removeProjection';
import { upsertProjection } from '../../infrastructure/upsertProjection';

export type SubscriptionEvent = (Période.PériodeNotifiéeEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Periode', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<Période.PériodeEntity>(`période|${payload.id}`);
    } else {
      switch (type) {
        case 'PériodeNotifiée-V1':
          await upsertProjection<Période.PériodeEntity>(`période|${payload.identifiantPériode}`, {
            estNotifiée: true,
            ...payload,
          });
          break;
      }
    }
  };

  mediator.register('System.Projector.Periode', handler);
};
