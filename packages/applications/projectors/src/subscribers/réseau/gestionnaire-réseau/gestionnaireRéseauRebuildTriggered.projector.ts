import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { clearProjection } from '../../../helpers/index.js';

export const gestionnaireRéseauRebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await clearProjection<GestionnaireRéseau.GestionnaireRéseauEntity>('gestionnaire-réseau', id);
};
