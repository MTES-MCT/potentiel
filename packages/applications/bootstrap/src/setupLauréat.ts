import { registerLauréatQueries, registerLauréatUseCases } from '@potentiel-domain/laureat';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import { registerAbandonProjector } from '@potentiel-infrastructure/projectors';

export const setupLauréat = async () => {
  registerLauréatUseCases({
    loadAggregate,
  });

  registerLauréatQueries({
    find: findProjection,
    list: listProjection,
  });

  registerAbandonProjector();

  // return await subscribe<AbandonEvent>({
  //   name: 'projector',
  //   eventType: [
  //     'AbandonDemandé-V1',
  //     'AbandonAccordé-V1',
  //     'AbandonAnnulé-V1',
  //     'AbandonConfirmé-V1',
  //     'AbandonRejeté-V1',
  //     'ConfirmationAbandonDemandée-V1',
  //     'RebuildTriggered',
  //   ],
  //   eventHandler: async (event) => {
  //     await mediator.publish<ExecuteAbandonProjector>({
  //       type: 'EXECUTE_ABANDON_PROJECTOR',
  //       data: event,
  //     });
  //   },
  //   streamCategory: 'abandon',
  // });
};
