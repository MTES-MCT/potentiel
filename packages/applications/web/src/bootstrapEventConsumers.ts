import {
  gestionnaireRéseauAjoutéHandlerFactory,
  gestionnaireRéseauModifiéHandlerFactory,
} from '@potentiel/domain';
import { createProjection, updateProjection } from '@potentiel/pg-projections';
import { consumerFactory } from '@potentiel/redis-event-bus-consumer';

export async function bootstrapEventConsumers() {
  const consumer = await consumerFactory('gestionnaireRéseauProjector');
  consumer.consume(
    'GestionnaireRéseauAjouté',
    gestionnaireRéseauAjoutéHandlerFactory(createProjection),
  );
  consumer.consume(
    'GestionnaireRéseauModifié',
    gestionnaireRéseauModifiéHandlerFactory(updateProjection),
  );
}
