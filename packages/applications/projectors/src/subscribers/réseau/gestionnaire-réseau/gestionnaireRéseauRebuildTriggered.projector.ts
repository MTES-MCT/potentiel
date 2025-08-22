import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

export const gestionnaireRéseauRebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await removeProjection<GestionnaireRéseau.GestionnaireRéseauEntity>(`gestionnaire-réseau|${id}`);
};
