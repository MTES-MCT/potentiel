import { subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import * as RaccordementSaga from './raccordement.saga';
import * as AbandonSaga from './abandon.saga';
import { mediator } from 'mediateur';

/**
 * @deprecated à bouger dans la nouvelle app
 */
export const registerSagas = async () => {
  RaccordementSaga.register();
  AbandonSaga.register();

  const unsubscribeRaccordement = await subscribe<RaccordementSaga.SubscriptionEvent>({
    name: 'legacy-saga',
    eventType: ['DateMiseEnServiceTransmise-V1', 'DemandeComplèteDeRaccordementTransmise-V2'],
    eventHandler: async (event) => {
      await mediator.send<RaccordementSaga.Execute>({
        type: 'EXECUTE_RACCORDEMENT_SAGA',
        data: event,
      });
    },
    streamCategory: 'raccordement',
  });

  const unsubscribeAbandon = await subscribe<AbandonSaga.SubscriptionEvent>({
    name: 'legacy-saga',
    eventType: ['AbandonAccordé-V1'],
    eventHandler: async (event) => {
      await mediator.send<AbandonSaga.Execute>({
        type: 'EXECUTE_ABANDON_SAGA',
        data: event,
      });
    },
    streamCategory: 'abandon',
  });

  return async () => {
    await unsubscribeRaccordement();
    await unsubscribeAbandon();
  };
};
