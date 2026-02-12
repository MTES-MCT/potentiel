import assert from 'assert';

import { Lauréat } from '@potentiel-domain/projet';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';
import {
  removeProjection,
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';
import { Where } from '@potentiel-domain/entity';

export const dossierDuRaccordementSuppriméV1Projector = async ({
  payload: { identifiantProjet, référenceDossier },
}:
  | Lauréat.Raccordement.DossierDuRaccordementSuppriméEvent
  | Lauréat.Raccordement.DossierDuRaccordementSuppriméEventV1) => {
  const raccordement = await findProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
  );

  assert(Option.isSome(raccordement));

  await removeProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossier}`,
  );

  const autresDossiers = await listProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    'dossier-raccordement',
    {
      where: {
        identifiantProjet: Where.equal(identifiantProjet),
        référence: Where.notEqual(référenceDossier),
        miseEnService: {
          dateMiseEnService: Where.notEqualNull(),
        },
      },
      orderBy: {
        miseEnService: {
          dateMiseEnService: 'descending',
        },
      },
    },
  );

  if (autresDossiers.items.length === 0) {
    await upsertProjection<Lauréat.Raccordement.RaccordementEntity>(
      `raccordement|${identifiantProjet}`,
      {
        identifiantProjet,
        identifiantGestionnaireRéseau: raccordement.identifiantGestionnaireRéseau,
      },
    );
  } else {
    await updateOneProjection<Lauréat.Raccordement.RaccordementEntity>(
      `raccordement|${identifiantProjet}`,
      {
        miseEnService: {
          date: autresDossiers.items[0].miseEnService?.dateMiseEnService,
          référenceDossierRaccordement: autresDossiers.items[0].référence,
        },
      },
    );
  }
};
