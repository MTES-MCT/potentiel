import { Message, MessageHandler, mediator } from 'mediateur';

import {
  TâchePlanifiéeEvent,
  TâchePlanifiéeEntity,
  TypeTâchePlanifiée,
  TypeTâche,
} from '@potentiel-domain/tache';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';

import { upsertProjection } from '../../infrastructure/upsertProjection';
import { removeProjection } from '../../infrastructure/removeProjection';

export type SubscriptionEvent = (TâchePlanifiéeEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.TâchePlanifiée', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<TâchePlanifiéeEntity>(`tâche-planifiée|${payload.id}`);
    } else {
      const { identifiantProjet, typeTâchePlanifiée } = payload;

      const tâche = await récupérerTâchePlanifiée(typeTâchePlanifiée, identifiantProjet);

      switch (type) {
        case 'TâchePlanifiéeAjoutée-V1':
          await upsertProjection<TâchePlanifiéeEntity>(
            `tâche-planifiée|${payload.typeTâchePlanifiée}#${identifiantProjet}`,
            {
              ...tâche,
              typeTâche: payload.typeTâchePlanifiée,
              misÀJourLe: payload.ajoutéeLe,
              àExecuterLe: payload.àExécuterLe,
            },
          );
          break;
      }
    }
  };

  mediator.register('System.Projector.TâchePlanifiée', handler);
};

const récupérerTâchePlanifiée = async (
  typeTâchePlanifiée: TypeTâchePlanifiée.RawType,
  identifiantProjet: string,
) => {
  const tâcheEntity = await findProjection<TâchePlanifiéeEntity>(
    `tâche-planifiée|${typeTâchePlanifiée}#${identifiantProjet}`,
  );

  const tâcheDefaultEntity: TâchePlanifiéeEntity = {
    identifiantProjet,
    typeTâche: TypeTâche.inconnue.type,
    misÀJourLe: DateTime.now().formatter(),
    àExecuterLe: DateTime.now().formatter(),
    type: 'tâche-planifiée',
  };

  const tâche: TâchePlanifiéeEntity = Option.match(tâcheEntity)
    .some((value) => value)
    .none(() => tâcheDefaultEntity);
  return tâche;
};
