import { Where } from '@potentiel-domain/entity';
import { Raccordement } from '@potentiel-domain/laureat';
import {
  upsertProjection,
  updateManyProjections,
} from '@potentiel-infrastructure/pg-projection-write';

import { getRaccordement } from './_utils/getRaccordement';

export const gestionnaireRéseauAttribuéV1Projector = async ({
  payload: { identifiantProjet, identifiantGestionnaireRéseau },
}: Raccordement.GestionnaireRéseauAttribuéEvent) => {
  const raccordement = await getRaccordement(identifiantProjet);

  await upsertProjection<Raccordement.RaccordementEntity>(`raccordement|${identifiantProjet}`, {
    ...raccordement,
    dossiers: raccordement.dossiers.map((dossier) => ({
      ...dossier,
      identifiantGestionnaireRéseau,
    })),
    identifiantGestionnaireRéseau,
  });

  await updateManyProjections<Raccordement.DossierRaccordementEntity>(
    'dossier-raccordement',
    { identifiantProjet: Where.equal(identifiantProjet) },
    { identifiantGestionnaireRéseau },
  );
};
