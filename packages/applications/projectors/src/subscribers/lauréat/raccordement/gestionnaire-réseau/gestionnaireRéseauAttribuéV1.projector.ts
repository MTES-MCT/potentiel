import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  updateManyProjections,
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const gestionnaireRéseauAttribuéV1Projector = async ({
  payload: { identifiantProjet, identifiantGestionnaireRéseau },
  version,
}: Lauréat.Raccordement.GestionnaireRéseauAttribuéEvent & Event) => {
  if (version === 1) {
    await upsertProjection<Lauréat.Raccordement.RaccordementEntity>(
      `raccordement|${identifiantProjet}`,
      {
        identifiantProjet,
        identifiantGestionnaireRéseau,
      },
    );
  } else {
    await updateOneProjection<Lauréat.Raccordement.RaccordementEntity>(
      `raccordement|${identifiantProjet}`,
      {
        identifiantProjet,
        identifiantGestionnaireRéseau,
      },
    );
  }

  await updateManyProjections<Lauréat.Raccordement.DossierRaccordementEntity>(
    'dossier-raccordement',
    { identifiantProjet: Where.equal(identifiantProjet) },
    { identifiantGestionnaireRéseau },
  );
};
