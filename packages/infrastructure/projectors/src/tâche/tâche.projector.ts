import { Message, MessageHandler, mediator } from 'mediateur';

import { TâcheEvent, TâcheEntity } from '@potentiel-domain/tache';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { removeProjection } from '../utils/removeProjection';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { isNone, isSome } from '@potentiel/monads';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { upsertProjection } from '../utils/upsertProjection';
import { DateTime } from '@potentiel-domain/common';
import { getLogger } from '@potentiel/monitoring';

export type SubscriptionEvent = (TâcheEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Tâche', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<TâcheEntity>(`tâche|${payload.id}`);
    } else {
      const { identifiantProjet, typeTâche } = payload;

      const tâche = await findProjection<TâcheEntity>(
        `tâche|${payload.typeTâche}#${identifiantProjet}`,
      );

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

      const tâcheToUpsert: Omit<TâcheEntity, 'type'> = isSome(tâche) ? tâche : tâcheDefaultValue;

      const projet = await CandidatureAdapter.récupérerCandidatureAdapter(identifiantProjet);

      if (isNone(projet)) {
        getLogger().error(new Error(`Projet inconnu !`), { identifiantProjet, message: event });
      }

      switch (type) {
        case 'TâcheAchevée-V1':
          await removeProjection<TâcheEntity>(`tâche|${payload.typeTâche}#${identifiantProjet}`);
          break;
        case 'TâcheAjoutée-V1':
        case 'TâcheRenouvellée-V1':
          await upsertProjection<TâcheEntity>(`tâche|${payload.typeTâche}#${identifiantProjet}`, {
            ...tâcheToUpsert,
            nomProjet: isSome(projet) ? projet.nom : 'Projet inconnu',
            appelOffre: isSome(projet) ? projet.appelOffre : `N/A`,
            période: isSome(projet) ? projet.période : `N/A`,
            famille: isSome(projet) ? projet.famille : undefined,
            numéroCRE: isSome(projet) ? projet.numéroCRE : `N/A`,
            typeTâche: payload.typeTâche,
            misÀJourLe: payload.ajoutéeLe,
          });
          break;
        case 'TâcheRelancée-V1':
          await upsertProjection<TâcheEntity>(`tâche|${payload.typeTâche}#${identifiantProjet}`, {
            ...tâcheToUpsert,
            typeTâche: payload.typeTâche,
            misÀJourLe: event.payload.relancéeLe,
          });
      }
    }
  };

  mediator.register('System.Projector.Tâche', handler);
};
