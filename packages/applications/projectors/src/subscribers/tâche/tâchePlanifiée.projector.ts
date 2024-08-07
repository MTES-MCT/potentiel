import { Message, MessageHandler, mediator } from 'mediateur';

import { TâchePlanifiéeEvent, TâchePlanifiéeEntity } from '@potentiel-domain/tache-planifiee';
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
            `tâche-planifiée|${typeTâchePlanifiée}#${identifiantProjet}`,
            {
              ...tâche,
              typeTâche: typeTâchePlanifiée,
              misÀJourLe: payload.ajoutéeLe,
              àExécuterLe: payload.àExécuterLe,
            },
          );
          break;
        case 'TâchePlanifiéeAnnulée-V1':
          await removeProjection<TâchePlanifiéeEntity>(
            `tâche-planifiée|${typeTâchePlanifiée}#${identifiantProjet}`,
          );
          break;
        case 'TâchePlanifiéeExecutée-V1':
          await removeProjection<TâchePlanifiéeEntity>(
            `tâche-planifiée|${typeTâchePlanifiée}#${identifiantProjet}`,
          );
      }
    }
  };

  mediator.register('System.Projector.TâchePlanifiée', handler);
};

const récupérerTâchePlanifiée = async (typeTâchePlanifiée: string, identifiantProjet: string) => {
  const tâcheEntity = await findProjection<TâchePlanifiéeEntity>(
    `tâche-planifiée|${typeTâchePlanifiée}#${identifiantProjet}`,
  );

  const tâcheDefaultEntity: TâchePlanifiéeEntity = {
    identifiantProjet,
    typeTâche: '',
    misÀJourLe: DateTime.now().formatter(),
    àExécuterLe: DateTime.now().formatter(),
    type: 'tâche-planifiée',
  };

  const tâche: TâchePlanifiéeEntity = Option.match(tâcheEntity)
    .some((value) => value)
    .none(() => tâcheDefaultEntity);
  return tâche;
};
