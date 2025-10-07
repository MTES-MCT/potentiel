import { mediator } from 'mediateur';

import { HistoriqueProjector } from '@potentiel-applications/projectors';
import { subscribe } from '@potentiel-infrastructure/pg-event-sourcing';

// TODO move to Subscribers
export const setupHistorique = async () => {
  HistoriqueProjector.register();

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

  return async () => {
    await unsubscribeGarantiesFinancièresHistoriqueProjector();
  };
};
