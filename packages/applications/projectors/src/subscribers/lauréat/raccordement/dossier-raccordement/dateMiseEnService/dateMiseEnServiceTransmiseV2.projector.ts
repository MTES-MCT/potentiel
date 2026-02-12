import assert from 'assert';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';
import { Where } from '@potentiel-domain/entity';

export const dateMiseEnServiceTransmiseV2Projector = async ({
  payload: {
    identifiantProjet,
    référenceDossierRaccordement,
    dateMiseEnService,
    transmiseLe,
    transmisePar,
  },
  created_at,
}: Lauréat.Raccordement.DateMiseEnServiceTransmiseEvent & Event) => {
  const raccordementActuel = await findProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
  );

  assert(Option.isSome(raccordementActuel));

  await updateOneProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
    {
      miseEnService: {
        dateMiseEnService,
        transmiseLe,
        transmisePar,
      },
      miseÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  );

  if (!raccordementActuel.miseEnService) {
    await updateOneProjection<Lauréat.Raccordement.RaccordementEntity>(
      `raccordement|${identifiantProjet}`,
      {
        miseEnService: {
          date: dateMiseEnService,
          référenceDossierRaccordement,
        },
      },
    );
    return;
  }

  const autresDossiersEnService =
    await listProjection<Lauréat.Raccordement.DossierRaccordementEntity>(`dossier-raccordement`, {
      where: {
        identifiantProjet: Where.equal(identifiantProjet),
        référence: Where.notEqual(référenceDossierRaccordement),
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

  if (autresDossiersEnService.items.length === 0) {
    await updateOneProjection<Lauréat.Raccordement.RaccordementEntity>(
      `raccordement|${identifiantProjet}`,
      {
        miseEnService: {
          date: dateMiseEnService,
          référenceDossierRaccordement,
        },
      },
    );
    return;
  }

  const dateMiseEnServiceTransmise = DateTime.convertirEnValueType(dateMiseEnService);
  const dateMiseEnServicePlusTardiveDesAutresDossiers = DateTime.convertirEnValueType(
    autresDossiersEnService.items[0].miseEnService!.dateMiseEnService,
  );

  if (dateMiseEnServiceTransmise.estAntérieurÀ(dateMiseEnServicePlusTardiveDesAutresDossiers)) {
    await updateOneProjection<Lauréat.Raccordement.RaccordementEntity>(
      `raccordement|${identifiantProjet}`,
      {
        miseEnService: {
          date: dateMiseEnServicePlusTardiveDesAutresDossiers.formatter(),
          référenceDossierRaccordement: autresDossiersEnService.items[0].référence,
        },
      },
    );
  } else {
    await updateOneProjection<Lauréat.Raccordement.RaccordementEntity>(
      `raccordement|${identifiantProjet}`,
      { miseEnService: { date: dateMiseEnService, référenceDossierRaccordement } },
    );
  }
};
