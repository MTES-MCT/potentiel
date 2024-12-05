import { Message, MessageHandler, mediator } from 'mediateur';

import { Actionnaire, Lauréat } from '@potentiel-domain/laureat';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { upsertProjection } from '../../infrastructure/upsertProjection';

export type SubscriptionEvent = (Actionnaire.ActionnaireEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Actionnaire', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      const { id } = payload;

      const lauréatProjection = await findProjection<Lauréat.LauréatEntity>(`lauréat|${id}`);

      if (Option.isSome(lauréatProjection)) {
        await upsertProjection<Lauréat.LauréatEntity>(`lauréat|${id}`, {
          ...lauréatProjection,
          représentantLégal: undefined,
        });
      }
    } else {
      const { identifiantProjet } = payload;

      const lauréat = await findProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`);

      if (Option.isNone(lauréat)) {
        getLogger().error(
          new Error(
            `[System.Projector.Lauréat.Actionnaire] Projection lauréat non trouvée pour le projet ${identifiantProjet}`,
          ),
        );
        return;
      }

      switch (type) {
        case 'ActionnaireImporté-V1':
          await upsertProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
            ...lauréat,
            identifiantProjet,
            actionnaire: {
              nom: payload.actionnaire,
              dernièreMiseÀJourLe: payload.importéLe,
            },
          });
          break;
      }
    }
  };

  mediator.register('System.Projector.Lauréat.Actionnaire', handler);
};
