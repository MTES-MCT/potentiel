import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import {
  updateManyProjections,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const gestionnaireRéseauRaccordementModifiéV2Projector = async ({
  payload: { identifiantGestionnaireRéseau, identifiantProjet },
}: Lauréat.Raccordement.GestionnaireRéseauRaccordementModifiéEvent) => {
  await upsertProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
    {
      identifiantProjet,
      identifiantGestionnaireRéseau,
    },
  );

  await updateManyProjections<Lauréat.Raccordement.DossierRaccordementEntity>(
    'dossier-raccordement',
    { identifiantProjet: Where.equal(identifiantProjet) },
    { identifiantGestionnaireRéseau },
  );
};
