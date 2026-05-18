import type { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const gestionnaireRéseauAjoutéProjector = async ({
  payload,
}:
  | GestionnaireRéseau.GestionnaireRéseauAjoutéEvent
  | GestionnaireRéseau.GestionnaireRéseauModifiéEvent) => {
  await upsertProjection<GestionnaireRéseau.GestionnaireRéseauEntity>(
    `gestionnaire-réseau|${payload.codeEIC}`,
    payload,
  );
};
