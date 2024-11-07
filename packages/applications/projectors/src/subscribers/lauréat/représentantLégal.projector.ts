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

    switch (type) {
      case 'ReprésentantLégalImporté-V1':
        const { identifiantProjet, nomReprésentantLégal, importéLe, importéPar } = payload;
        try {
          await createProjection<ReprésentantLégal.ReprésentantLégalEntity>(
            `représentant-légal|${identifiantProjet}`,
            {
              identifiantProjet,
              nomReprésentantLégal,
              import: {
                importéLe,
                importéPar,
              },
            },
          );
        } catch (e) {
          console.error(e);
        }
        break;
    }
  };

  mediator.register('System.Projector.Lauréat.ReprésentantLégal', handler);
};
