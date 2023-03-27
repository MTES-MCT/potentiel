import {
  gestionnaireRéseauAjoutéHandlerFactory,
  gestionnaireRéseauModifiéHandlerFactory,
} from '@potentiel/domain';
import { createProjection, updateProjection } from '@potentiel/pg-projections';
import { consumerFactory } from '@potentiel/redis-event-bus-consumer';

export async function bootstrapEventConsumers() {
  const consume = await consumerFactory('gestionnaireRéseauProjector');
  consume('GestionnaireRéseauAjouté', gestionnaireRéseauAjoutéHandlerFactory(createProjection));
  consume('GestionnaireRéseauModifié', gestionnaireRéseauModifiéHandlerFactory(updateProjection));
}
