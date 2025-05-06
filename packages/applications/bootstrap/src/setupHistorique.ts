import { mediator } from 'mediateur';

import { Historique } from '@potentiel-domain/historique';
import { HistoriqueProjector } from '@potentiel-applications/projectors';
import { subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { listHistoryProjection } from '@potentiel-infrastructure/pg-projection-read';

// viovio
export const setupHistorique = async () => {
  Historique.registerHistoriqueProjetQuery({
    listHistory: listHistoryProjection,
  });

  HistoriqueProjector.register();

  const unsubscribeAbandonHistoriqueProjector =
    await subscribe<HistoriqueProjector.SubscriptionEvent>({
      name: 'history',
      eventType: 'all',
      eventHandler: async (event) => {
        await mediator.send<HistoriqueProjector.Execute>({
          type: 'System.Projector.Historique',
          data: event,
        });
      },
      streamCategory: 'abandon',
    });

  const unsubscribeRecoursHistoriqueProjector =
    await subscribe<HistoriqueProjector.SubscriptionEvent>({
      name: 'history',
      eventType: 'all',
      eventHandler: async (event) => {
        await mediator.send<HistoriqueProjector.Execute>({
          type: 'System.Projector.Historique',
          data: event,
        });
      },
      streamCategory: 'recours',
    });

  const unsubscribeActionnaireHistoriqueProjector =
    await subscribe<HistoriqueProjector.SubscriptionEvent>({
      name: 'history',
      eventType: 'all',
      eventHandler: async (event) => {
        await mediator.send<HistoriqueProjector.Execute>({
          type: 'System.Projector.Historique',
          data: event,
        });
      },
      streamCategory: 'actionnaire',
    });

  const unsubscribeReprésentantLégalHistoriqueProjector =
    await subscribe<HistoriqueProjector.SubscriptionEvent>({
      name: 'history',
      eventType: 'all',
      eventHandler: async (event) => {
        await mediator.send<HistoriqueProjector.Execute>({
          type: 'System.Projector.Historique',
          data: event,
        });
      },
      streamCategory: 'représentant-légal',
    });

  const unsubscribePuissanceHistoriqueProjector =
    await subscribe<HistoriqueProjector.SubscriptionEvent>({
      name: 'history',
      eventType: 'all',
      eventHandler: async (event) => {
        await mediator.send<HistoriqueProjector.Execute>({
          type: 'System.Projector.Historique',
          data: event,
        });
      },
      streamCategory: 'puissance',
    });

  const unsubscribeProducteurHistoriqueProjector =
    await subscribe<HistoriqueProjector.SubscriptionEvent>({
      name: 'history',
      eventType: 'all',
      eventHandler: async (event) => {
        await mediator.send<HistoriqueProjector.Execute>({
          type: 'System.Projector.Historique',
          data: event,
        });
      },
      streamCategory: 'producteur',
    });

  return async () => {
    await unsubscribeAbandonHistoriqueProjector();
    await unsubscribeRecoursHistoriqueProjector();
    await unsubscribeActionnaireHistoriqueProjector();
    await unsubscribeReprésentantLégalHistoriqueProjector();
    await unsubscribePuissanceHistoriqueProjector();
    await unsubscribeProducteurHistoriqueProjector();
  };
};
