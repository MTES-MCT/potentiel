import { Message, MessageHandler, mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/laureat';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { upsertProjection } from '../../infrastructure/upsertProjection';
import { removeProjection } from '../../infrastructure';

export type SubscriptionEvent = (Lauréat.LauréatEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<Lauréat.LauréatEntity>(`lauréat|${payload.id}`);
    } else {
      switch (type) {
        case 'LauréatNotifié-V2':
          const { identifiantProjet, notifiéLe, notifiéPar, nomProjet, localité } = payload;

          await upsertProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
            identifiantProjet,
            notifiéLe,
            notifiéPar,
            nomProjet,
            localité,
          });
          break;
      }
    }
  };

  mediator.register('System.Projector.Lauréat', handler);
};
