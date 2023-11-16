import { registerLauréatQueries, registerLauréatUseCases } from '@potentiel-domain/laureat';
import { loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import {
  AbandonEvent,
  ExecuteAbandonAvecRecandidatureSansPreuveProjector,
  ExecuteAbandonProjector,
  registerAbandonProjector,
} from '@potentiel-infrastructure/projectors';
import { mediator } from 'mediateur';

export const setupLauréat = async () => {
  registerLauréatUseCases({
    loadAggregate,
  });

  registerLauréatQueries({
    find: findProjection,
    list: listProjection,
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

      if (
        event.type === 'PreuveRecandidatureDemandée-V1' ||
        event.type === 'PreuveRecandidatureTransmise-V1' ||
        event.type === 'RebuildTriggered'
      ) {
        await mediator.send<ExecuteAbandonAvecRecandidatureSansPreuveProjector>({
          type: 'EXECUTE_ABANDON_AVEC_RECANDIDATURE_SANS_PREUVE_PROJECTOR',
          data: event,
        });
      }
    },
    streamCategory: 'abandon',
  });
};
