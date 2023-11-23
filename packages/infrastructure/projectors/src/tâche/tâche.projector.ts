import { Message, MessageHandler, mediator } from 'mediateur';

import { NombreTâchesProjection, TâcheEvent, TâcheProjection } from '@potentiel-domain/tache';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { removeProjection } from '../utils/removeProjection';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { isSome } from '@potentiel/monads';
import { upsertProjection } from '../utils/upsertProjection';

export type SubscriptionEvent = (TâcheEvent & Event) | RebuildTriggered;

export type Execute = Message<'EXECUTE_TÂCHE_PROJECTOR', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<TâcheProjection>(`tâche|${payload.id}`);
      await removeProjection<NombreTâchesProjection>(`nombre-de-tâches|${payload.id}`);
    } else {
      const { identifiantProjet } = payload;

      const nombreTâchesProjection = await findProjection<NombreTâchesProjection>(
        `nombre-de-tâches|${identifiantProjet}`,
      );

      const nombreTâchesDefaultValue = 0;

      const nombreTâchesToUpsert = isSome(nombreTâchesProjection)
        ? nombreTâchesProjection.nombreTâches
        : nombreTâchesDefaultValue;

      switch (type) {
        case 'TâcheAchevée-V1':
          await upsertProjection<NombreTâchesProjection>(`nombre-de-tâches|${identifiantProjet}`, {
            identifiantProjet,
            nombreTâches: nombreTâchesToUpsert - 1,
          });
          break;
        case 'TâcheAjoutée-V1':
          await upsertProjection<NombreTâchesProjection>(`nombre-de-tâches|${identifiantProjet}`, {
            identifiantProjet,
            nombreTâches: nombreTâchesToUpsert + 1,
          });
          break;
      }
    }
  };

  mediator.register('EXECUTE_TÂCHE_PROJECTOR', handler);
};
