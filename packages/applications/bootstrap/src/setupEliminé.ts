import { registerEliminéQueries, registerEliminéUseCases } from '@potentiel-domain/elimine';
import { loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjectionV2 } from '@potentiel-infrastructure/pg-projections';
import { mediator } from 'mediateur';
import {
  listerIdentifiantsProjetsParPorteurAdapter,
  récupérerRégionDrealAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { RecoursProjector } from '@potentiel-applications/projectors';

export const setupEliminé = async () => {
  registerEliminéUseCases({
    loadAggregate,
  });

  registerEliminéQueries({
    find: findProjection,
    list: listProjectionV2,
    listerProjetsAccessibles: listerIdentifiantsProjetsParPorteurAdapter,
    récupérerRégionDreal: récupérerRégionDrealAdapter,
  });

  RecoursProjector.register();

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
        type: 'System.Projector.Eliminé.Recours',
        data: event,
      });
    },
    streamCategory: 'recours',
  });

  return async () => {
    await unsubscribeRecoursProjector();
  };
};
