import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { TâcheEvent, TâcheEntity, TypeTâche } from '@potentiel-domain/tache';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { DateTime } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';

import { upsertProjection } from '../../infrastructure/upsertProjection';
import { removeProjection } from '../../infrastructure/removeProjection';

export type SubscriptionEvent = (TâcheEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Tâche', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<TâcheEntity>(`tâche|${payload.id}`);
    } else {
      const { identifiantProjet, typeTâche } = payload;

      const [tâche, projet] = await Promise.all([
        récupérerTâche(typeTâche, identifiantProjet),
        récupérerProjet(identifiantProjet),
      ]);

      if (!projet) {
        getLogger().warn(`Projet inconnu !`, { identifiantProjet, event });
      }

      switch (type) {
        case 'TâcheAchevée-V1':
          await removeProjection<TâcheEntity>(`tâche|${payload.typeTâche}#${identifiantProjet}`);
          break;
        case 'TâcheAjoutée-V1':
        case 'TâcheRenouvellée-V1':
          await upsertProjection<TâcheEntity>(`tâche|${payload.typeTâche}#${identifiantProjet}`, {
            ...tâche,
            typeTâche: payload.typeTâche,
            misÀJourLe: payload.ajoutéeLe,
            projet,
          });
          break;
        case 'TâcheRelancée-V1':
          await upsertProjection<TâcheEntity>(`tâche|${payload.typeTâche}#${identifiantProjet}`, {
            ...tâche,
            typeTâche: payload.typeTâche,
            misÀJourLe: event.payload.relancéeLe,
          });
          break;
      }
    }
  };

  mediator.register('System.Projector.Tâche', handler);
};

const récupérerTâche = async (typeTâche: string, identifiantProjet: string) => {
  const tâcheEntity = await findProjection<TâcheEntity>(`tâche|${typeTâche}#${identifiantProjet}`);

  const tâcheDefaultEntity: TâcheEntity = {
    identifiantProjet,
    typeTâche: TypeTâche.inconnue.type,
    misÀJourLe: DateTime.now().formatter(),
    type: 'tâche',
  };

  const tâche: TâcheEntity = Option.match(tâcheEntity)
    .some((value) => value)
    .none(() => tâcheDefaultEntity);
  return tâche;
};

const récupérerProjet = async (identifiantProjet: string) => {
  const projetEntity = await CandidatureAdapter.récupérerProjetAdapter(identifiantProjet);

  const projet = Option.match(projetEntity)
    .some<TâcheEntity['projet']>(({ nom, appelOffre, période, numéroCRE, famille }) => ({
      appelOffre,
      nom,
      numéroCRE,
      période,
      famille: match(famille)
        .with('', () => undefined)
        .otherwise((value) => value),
    }))
    .none(() => undefined);

  return projet;
};
