import { Message, MessageHandler, mediator } from 'mediateur';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { removeProjection, createProjection } from '../../infrastructure/';

export type SubscriptionEvent =
  | (ReprésentantLégal.ReprésentantLégalEvent & Event)
  | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.ReprésentantLégal', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<ReprésentantLégal.ReprésentantLégalEntity>(
        `représentant-légal|${payload.id}`,
      );
      return;
    }

    const { identifiantProjet } = payload;

    switch (type) {
      case 'ReprésentantLégalImporté-V1':
        await createProjection<ReprésentantLégal.ReprésentantLégalEntity>(
          `représentant-légal|${identifiantProjet}`,
          {
            identifiantProjet,
            nomReprésentantLégal: payload.nomReprésentantLégal,
            import: {
              importéLe: payload.importéLe,
              importéPar: payload.importéPar,
            },
          },
        );
        break;
    }
  };

  mediator.register('System.Projector.Lauréat.ReprésentantLégal', handler);
};
