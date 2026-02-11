import assert from 'assert';

import { DateTime } from '@potentiel-domain/common';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';
import { Where } from '@potentiel-domain/entity';

export const dateMiseEnServiceSuppriméeV1Projector = async ({
  payload: { identifiantProjet, référenceDossierRaccordement },
  created_at,
}: Lauréat.Raccordement.DateMiseEnServiceSuppriméeEvent & Event) => {
  await updateOneProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
    {
      miseEnService: {
        dateMiseEnService: undefined,
      },
      miseÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  );

  const raccordement = await findProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
  );

  assert(Option.isSome(raccordement));

  await upsertProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
    {
      identifiantProjet,
      identifiantGestionnaireRéseau: raccordement.identifiantGestionnaireRéseau,
    },
  );

  const dossiersEnServiceRestant =
    await listProjection<Lauréat.Raccordement.DossierRaccordementEntity>('dossier-raccordement', {
      where: {
        identifiantProjet: Where.equal(identifiantProjet),
        miseEnService: {
          dateMiseEnService: Where.notEqualNull(),
        },
      },
      orderBy: {
        miseEnService: {
          dateMiseEnService: 'descending',
        },
      },
    });

  if (dossiersEnServiceRestant.items.length > 0) {
    await updateOneProjection<Lauréat.Raccordement.RaccordementEntity>(
      `raccordement|${identifiantProjet}`,
      {
        miseEnService: {
          date: dossiersEnServiceRestant.items[0].miseEnService?.dateMiseEnService,
          référenceDossierRaccordement: dossiersEnServiceRestant.items[0].référence,
        },
      },
    );
  }
};
