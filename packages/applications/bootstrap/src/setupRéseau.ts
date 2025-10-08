import { GestionnaireRéseauProjector } from '@potentiel-applications/projectors';
import { registerRéseauQueries, registerRéseauUseCases } from '@potentiel-domain/reseau';
import { loadAggregateV2 } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';

import { createSubscriptionSetup } from './createSubscriptionSetup';

export const setupRéseau = async () => {
  registerRéseauUseCases({
    loadAggregate: loadAggregateV2,
  });

  registerRéseauQueries({
    list: listProjection,
    find: findProjection,
  });

  GestionnaireRéseauProjector.register();
  const gestionnaireRéseau = createSubscriptionSetup('gestionnaire-réseau');

  await gestionnaireRéseau.setupSubscription<
    GestionnaireRéseauProjector.SubscriptionEvent,
    GestionnaireRéseauProjector.Execute
  >({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'GestionnaireRéseauAjouté-V1',
      'GestionnaireRéseauModifié-V1',
      'GestionnaireRéseauAjouté-V2',
      'GestionnaireRéseauModifié-V2',
    ],
    messageType: 'System.Projector.Réseau.Gestionnaire',
  });

  return gestionnaireRéseau.clearSubscriptions;
};
