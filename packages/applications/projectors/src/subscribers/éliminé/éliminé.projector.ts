import { Message, MessageHandler, mediator } from 'mediateur';

import { Éliminé } from '@potentiel-domain/elimine';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { removeProjection } from '../../infrastructure/removeProjection';
import { upsertProjection } from '../../infrastructure/upsertProjection';

export type SubscriptionEvent = (Éliminé.ÉliminéEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Éliminé', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<Éliminé.ÉliminéEntity>(`éliminé|${payload.id}`);
    } else {
      const { identifiantProjet, dateNotification } = payload;

      switch (type) {
        case 'ÉliminéNotifié-V1':
          await upsertProjection<Éliminé.ÉliminéEntity>(`éliminé|${identifiantProjet}`, {
            identifiantProjet,
            dateDésignation: dateNotification,
          });
          break;
      }
    }
  };

  mediator.register('System.Projector.Éliminé', handler);
};
