import { GestionnaireRéseauProjector } from '@potentiel-applications/projectors';

import { createSubscriptionSetup } from './createSubscriptionSetup.js';

export const setupRéseau = () => {
  GestionnaireRéseauProjector.register();
  const gestionnaireRéseau = createSubscriptionSetup('gestionnaire-réseau');

  gestionnaireRéseau.addSubscription<
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

  return gestionnaireRéseau;
};
