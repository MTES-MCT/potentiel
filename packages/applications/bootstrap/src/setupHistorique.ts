import { mediator } from 'mediateur';

import { HistoriqueProjector } from '@potentiel-applications/projectors';
import { subscribe } from '@potentiel-infrastructure/pg-event-sourcing';

export const setupHistorique = async () => {
  HistoriqueProjector.register();

  // TODO move dans setupProjet/setupLauréat/setupActionnaire une fois le domaine migré
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

  // TODO move dans setupProjet/setupLauréat/setupReprésentantLégal une fois le domaine migré
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

  // TODO move dans setupProjet/setupLauréat/setupGarantiesFinancières une fois le domaine migré
  const unsubscribeGarantiesFinancièresHistoriqueProjector =
    await subscribe<HistoriqueProjector.SubscriptionEvent>({
      name: 'history',
      eventType: 'all',
      eventHandler: async (event) => {
        await mediator.send<HistoriqueProjector.Execute>({
          type: 'System.Projector.Historique',
          data: event,
        });
      },
      streamCategory: 'garanties-financieres',
    });

  // TODO move dans setupProjet/setupLauréat/setupRaccordement une fois le domaine migré
  const unsubscribeRaccordementHistoriqueProjector =
    await subscribe<HistoriqueProjector.SubscriptionEvent>({
      name: 'history',
      eventType: 'all',
      eventHandler: async (event) => {
        await mediator.send<HistoriqueProjector.Execute>({
          type: 'System.Projector.Historique',
          data: event,
        });
      },
      streamCategory: 'raccordement',
    });

  return async () => {
    await unsubscribeActionnaireHistoriqueProjector();
    await unsubscribeReprésentantLégalHistoriqueProjector();
    await unsubscribeGarantiesFinancièresHistoriqueProjector();
    await unsubscribeRaccordementHistoriqueProjector();
  };
};
