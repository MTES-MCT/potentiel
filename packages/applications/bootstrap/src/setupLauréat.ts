import { registerLauréatQueries, registerLauréatUseCases } from '@potentiel-domain/laureat';
import { loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import { registerLauréatAbandonNotification } from '@potentiel-infrastructure/notifications';
import {
  AbandonEvent,
  ExecuteAbandonProjector,
  registerAbandonProjector,
} from '@potentiel-infrastructure/projectors';
import { mediator } from 'mediateur';
import {
  CandidatureAdapter,
  récupérerPorteursProjetAdapter,
} from '@potentiel-infrastructure/domain-adapters';

export const setupLauréat = async () => {
  registerLauréatUseCases({
    loadAggregate,
  });

  registerLauréatQueries({
    find: findProjection,
    list: listProjection,
  });

  registerLauréatAbandonNotification({
    récupérerCandidature: CandidatureAdapter.récupérerCandidatureAdapter,
    récupérerPorteursProjet: récupérerPorteursProjetAdapter,
  });

  registerAbandonProjector();

  return await subscribe<AbandonEvent>({
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
      await mediator.send<ExecuteAbandonProjector>({
        type: 'EXECUTE_ABANDON_PROJECTOR',
        data: event,
      });
    },
    streamCategory: 'abandon',
  });
};
