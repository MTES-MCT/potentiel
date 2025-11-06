import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { rebuildProjection } from '../../../helpers';

export const gestionnaireRéseauRebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await rebuildProjection<GestionnaireRéseau.GestionnaireRéseauEntity>('gestionnaire-réseau', id);
};
