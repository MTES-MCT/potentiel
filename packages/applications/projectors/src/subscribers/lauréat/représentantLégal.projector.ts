import { Message, MessageHandler, mediator } from 'mediateur';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projections';

import { removeProjection, upsertProjection } from '../../infrastructure/';

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

    const représentantLégal = await findProjection<ReprésentantLégal.ReprésentantLégalEntity>(
      `représentant-légal|${identifiantProjet}`,
    );

    const représentantLégalDefaultValue: Omit<ReprésentantLégal.ReprésentantLégalEntity, 'type'> = {
      identifiantProjet,
      nomReprésentantLégal: '',
      import: {
        importéLe: '',
        importéPar: '',
      },
    };

    const représentantLégalToUpsert: Omit<ReprésentantLégal.ReprésentantLégalEntity, 'type'> =
      Option.isSome(représentantLégal) ? représentantLégal : représentantLégalDefaultValue;

    switch (type) {
      case 'ReprésentantLégalImporté-V1':
        const { identifiantProjet, nomReprésentantLégal, importéLe, importéPar } = payload;
        try {
          await upsertProjection<ReprésentantLégal.ReprésentantLégalEntity>(
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
          getLogger().warn('Import du représentant légal impossible', {
            event: payload,
          });
        }
        break;
      case 'ReprésentantLégalModifié-V1':
        await upsertProjection<ReprésentantLégal.ReprésentantLégalEntity>(
          `représentant-légal|${payload.identifiantProjet}`,
          {
            ...représentantLégalToUpsert,
            nomReprésentantLégal: payload.nomReprésentantLégal,
          },
        );
    }
  };

  mediator.register('System.Projector.Lauréat.ReprésentantLégal', handler);
};
