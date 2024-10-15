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
      const { identifiantProjet } = payload;

      switch (type) {
        case 'ÉliminéNotifié-V1':
          const { notifiéLe, notifiéPar } = payload;
          await upsertProjection<Éliminé.ÉliminéEntity>(`éliminé|${identifiantProjet}`, {
            identifiantProjet,
            notifiéLe,
            notifiéPar,
          });
          break;
        case 'ÉliminéArchivé-V1':
          await removeProjection(`éliminé|${identifiantProjet}`);
          break;
      }
    }
  };

  mediator.register('System.Projector.Éliminé', handler);
};
