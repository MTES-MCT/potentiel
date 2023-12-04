import { registerLauréatQueries, registerLauréatUseCases } from '@potentiel-domain/laureat';
import { loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import { AbandonNotification } from '@potentiel-infrastructure/notifications';
import { AbandonProjector } from '@potentiel-infrastructure/projectors';
import { mediator } from 'mediateur';
import {
  CandidatureAdapter,
  consulterCahierDesChargesChoisiAdapter,
  récupérerPorteursProjetAdapter,
  listerIdentifiantsProjetsParPorteurAdapter,
  AbandonAdapter,
  listerIdentifiantsProjetsParDrealAdapter,
} from '@potentiel-infrastructure/domain-adapters';

export const setupLauréat = async () => {
  registerLauréatUseCases({
    loadAggregate,
  });

  registerLauréatQueries({
    find: findProjection,
    list: listProjection,
    consulterCahierDesChargesAdapter: consulterCahierDesChargesChoisiAdapter,
    listerIdentifiantsProjetsParPorteur: listerIdentifiantsProjetsParPorteurAdapter,
    listerAbandonsParProjets: AbandonAdapter.listerAbandonParProjetsAdapter,
    listerIdentifiantsProjetsParDreal: listerIdentifiantsProjetsParDrealAdapter,
  });

  AbandonNotification.register({
    récupérerCandidature: CandidatureAdapter.récupérerCandidatureAdapter,
    récupérerPorteursProjet: récupérerPorteursProjetAdapter,
  });

  AbandonProjector.register();

  const unsubscribeAbandonNotification = await subscribe<AbandonNotification.SubscriptionEvent>({
    name: 'notifications',
    streamCategory: 'abandon',
    eventType: ['PreuveRecandidatureDemandée-V1'],
    eventHandler: async (event) => {
      await mediator.publish<AbandonNotification.Execute>({
        type: 'EXECUTE_LAUREAT_ABANDON_NOTIFICATION',
        data: event,
      });
    },
  });

  const unsubscribeAbandonProjector = await subscribe<AbandonProjector.SubscriptionEvent>({
    name: 'projector',
    eventType: [
      'AbandonDemandé-V1',
      'AbandonAccordé-V1',
      'AbandonAnnulé-V1',
      'AbandonConfirmé-V1',
      'AbandonRejeté-V1',
      'PreuveRecandidatureTransmise-V1',
      'PreuveRecandidatureDemandée-V1',
      'ConfirmationAbandonDemandée-V1',
      'RebuildTriggered',
    ],
    eventHandler: async (event) => {
      await mediator.send<AbandonProjector.Execute>({
        type: 'EXECUTE_ABANDON_PROJECTOR',
        data: event,
      });
    },
    streamCategory: 'abandon',
  });

  return async () => {
    await unsubscribeAbandonNotification();
    await unsubscribeAbandonProjector();
  };
};
