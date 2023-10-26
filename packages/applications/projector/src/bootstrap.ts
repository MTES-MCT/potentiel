import { mediator } from 'mediateur';
import { subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { AbandonEvent, ExecuteAbandonProjector } from './lauréat/abandon.projector';

export type UnsetupApp = () => Promise<void>;

export const bootstrap = async (): Promise<UnsetupApp> => {
  const unsubscribeAbandonProjector = await subscribe<AbandonEvent>({
    name: 'projector',
    eventType: [
      'AbandonDemandé-V1',
      'AbandonAccordé-V1',
      'AbandonAnnulé-V1',
      'AbandonConfirmé-V1',
      'AbandonRejeté-V1',
      'ConfirmationAbandonDemandée-V1',
      'RebuildTriggered',
    ],
    eventHandler: async (event) => {
      await mediator.publish<ExecuteAbandonProjector>({
        type: 'EXECUTE_ABANDON_PROJECTOR',
        data: event,
      });
    },
    streamCategory: 'abandon',
  });

  return async () => {
    await unsubscribeAbandonProjector();
  };
};
