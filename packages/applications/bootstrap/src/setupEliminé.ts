import { registerEliminéQueries, registerEliminéUseCases } from '@potentiel-domain/elimine';
import { loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
// import { RecoursNotification } from '@potentiel-infrastructure/notifications';
import { RecoursProjector } from '@potentiel-infrastructure/projectors';
import { mediator } from 'mediateur';
import {
  listerRecoursAdapter,
  listerRecoursPourPorteurAdapter,
  récupérerRégionDrealAdapter,
} from '@potentiel-infrastructure/domain-adapters';

export const setupEliminé = async () => {
  registerEliminéUseCases({
    loadAggregate,
  });

  registerEliminéQueries({
    find: findProjection,
    listerRecoursPourPorteur: listerRecoursPourPorteurAdapter,
    listerRecours: listerRecoursAdapter,
    récupérerRégionDreal: récupérerRégionDrealAdapter,
  });

  RecoursProjector.register();
  // RecoursNotification.register();

  // const unsubscribeRecoursNotification = await subscribe<RecoursNotification.SubscriptionEvent>({
  //   name: 'notifications',
  //   streamCategory: 'recours',
  //   eventType: ['RecoursDemandé-V1', 'RecoursAccordé-V1', 'RecoursAnnulé-V1', 'RecoursRejeté-V1'],
  //   eventHandler: async (event) => {
  //     await mediator.publish<RecoursNotification.Execute>({
  //       type: 'EXECUTE_ELIMINE_RECOURS_NOTIFICATION',
  //       data: event,
  //     });
  //   },
  // });

  const unsubscribeRecoursProjector = await subscribe<RecoursProjector.SubscriptionEvent>({
    name: 'projector',
    eventType: [
      'RecoursDemandé-V1',
      'RecoursAccordé-V1',
      'RecoursAnnulé-V1',
      'RecoursRejeté-V1',
      'RebuildTriggered',
    ],
    eventHandler: async (event) => {
      await mediator.send<RecoursProjector.Execute>({
        type: 'EXECUTE_RECOURS_PROJECTOR',
        data: event,
      });
    },
    streamCategory: 'recours',
  });

  return async () => {
    // await unsubscribeRecoursNotification();
    await unsubscribeRecoursProjector();
  };
};
