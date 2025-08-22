import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

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
