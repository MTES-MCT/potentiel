import { Message, MessageHandler, mediator } from 'mediateur';

import {
  NombreTâchesProjection,
  TâcheEvent,
  TâcheProjection,
} from '@potentiel-domain/tache';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { removeProjection } from '../utils/removeProjection';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { isNone, isSome } from '@potentiel/monads';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { upsertProjection } from '../utils/upsertProjection';
import { DateTime } from '@potentiel-domain/common';
import { getLogger } from '@potentiel/monitoring';

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

      const tâche = await findProjection<TâcheProjection>(`tâche|${identifiantProjet}`);

      const tâcheDefaultValue = {
        identifiantProjet,
        nomProjet: '',
        appelOffre: '',
        période: '',
        numéroCRE: '',
        famille: undefined,
        typeTâche: '',
        misÀJourLe: DateTime.now().formatter(),
      };

      const tâcheToUpsert: Omit<TâcheProjection, 'type'> = isSome(tâche)
        ? tâche
        : tâcheDefaultValue;

      const projet = await CandidatureAdapter.récupérerCandidatureAdapter(identifiantProjet);

      if (isNone(projet)) {
        getLogger().error(new Error(`Projet inconnu !`), { identifiantProjet, message: event });
      }

      switch (type) {
        case 'TâcheAchevée-V1':
          await removeProjection<TâcheProjection>(
            `tâche|${identifiantProjet}#${payload.typeTâche}`,
          );
          break;
        case 'TâcheAjoutée-V1':
        case 'TâcheRenouvellée-V1':
          await upsertProjection<NombreTâchesProjection>(`nombre-de-tâches|${identifiantProjet}`, {
            identifiantProjet,
            nombreTâches: nombreTâchesToUpsert + 1,
          });

          await upsertProjection<TâcheProjection>(
            `tâche|${identifiantProjet}#${payload.typeTâche}`,
            {
              ...tâcheToUpsert,
              nomProjet: isSome(projet) ? projet.nom : 'Projet inconnu',
              appelOffre: isSome(projet) ? projet.appelOffre : `N/A`,
              période: isSome(projet) ? projet.période : `N/A`,
              famille: isSome(projet) ? projet.famille : undefined,
              numéroCRE: isSome(projet) ? projet.numéroCRE : `N/A`,
              typeTâche: payload.typeTâche,
              misÀJourLe: DateTime.now().formatter(),
            },
          );
          break;
        case 'TâcheRelancée-V1':
          await upsertProjection<TâcheProjection>(
            `tâche|${identifiantProjet}#${payload.typeTâche}`,
            {
              ...tâcheToUpsert,
              typeTâche: payload.typeTâche,
              misÀJourLe: DateTime.now().formatter(),
            },
          );
      }
    }
  };

  mediator.register('EXECUTE_TÂCHE_PROJECTOR', handler);
};
