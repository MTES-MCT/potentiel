import { gestionnaireRéseauAjoutéHandlerFactory } from '@potentiel/domain';
import { subscribe } from '@potentiel/pg-event-sourcing';
import { createProjection } from '@potentiel/pg-projections';
import { consumerFactory } from '@potentiel/redis-event-bus-consumer';
import { publishToEventBus } from '@potentiel/redis-event-bus-client';

export const bootstrap = async () => {
  // First step: initialize consumers
  const consume = await consumerFactory('gestionnaireRéseauProjector');
  consume('GestionnaireRéseauAjouté', gestionnaireRéseauAjoutéHandlerFactory(createProjection));

  // Second step: launch event stream subscriber
  await subscribe('all', async (event) => {
    await publishToEventBus(event.type, event);
  });

  // Third step: launch web
};
