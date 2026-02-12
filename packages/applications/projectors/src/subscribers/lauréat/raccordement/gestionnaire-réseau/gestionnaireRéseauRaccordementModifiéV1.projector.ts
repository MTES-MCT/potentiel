import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import {
  updateManyProjections,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const gestionnaireRéseauRaccordementModifiéV1Projector = async ({
  payload: { identifiantGestionnaireRéseau, identifiantProjet },
}: Lauréat.Raccordement.GestionnaireRéseauRaccordementModifiéEventV1) => {
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
