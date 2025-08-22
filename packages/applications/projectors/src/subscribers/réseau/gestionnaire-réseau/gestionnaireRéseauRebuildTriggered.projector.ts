import type { GestionnaireRéseau } from '@potentiel-domain/reseau';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const gestionnaireRéseauRebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await removeProjection<GestionnaireRéseau.GestionnaireRéseauEntity>(`gestionnaire-réseau|${id}`);
};
