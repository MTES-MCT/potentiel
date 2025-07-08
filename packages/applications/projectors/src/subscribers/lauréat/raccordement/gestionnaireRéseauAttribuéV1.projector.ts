import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import {
  upsertProjection,
  updateManyProjections,
} from '@potentiel-infrastructure/pg-projection-write';

import { getRaccordement } from './_utils/getRaccordement';

export const gestionnaireRéseauAttribuéV1Projector = async ({
  payload: { identifiantProjet, identifiantGestionnaireRéseau },
}: Lauréat.Raccordement.GestionnaireRéseauAttribuéEvent) => {
  const raccordement = await getRaccordement(identifiantProjet);

  await upsertProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
    {
      ...raccordement,
      dossiers: raccordement.dossiers.map((dossier) => ({
        ...dossier,
        identifiantGestionnaireRéseau,
      })),
      identifiantGestionnaireRéseau,
    },
  );

  await updateManyProjections<Lauréat.Raccordement.DossierRaccordementEntity>(
    'dossier-raccordement',
    { identifiantProjet: Where.equal(identifiantProjet) },
    { identifiantGestionnaireRéseau },
  );
};
