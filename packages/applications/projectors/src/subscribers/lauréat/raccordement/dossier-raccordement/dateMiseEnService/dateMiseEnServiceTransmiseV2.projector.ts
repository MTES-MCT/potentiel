import assert from 'assert';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

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

  console.log('RACCORDEMENT ACTUEL', raccordementActuel);

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

  assert(Option.isSome(raccordementActuel));

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

  const dateMiseEnServiceTransmise = DateTime.convertirEnValueType(dateMiseEnService);
  const dateMiseEnServiceActuelle = DateTime.convertirEnValueType(
    raccordementActuel.miseEnService.date,
  );

  if (dateMiseEnServiceActuelle.estAntérieurÀ(dateMiseEnServiceTransmise)) {
    await updateOneProjection<Lauréat.Raccordement.RaccordementEntity>(
      `raccordement|${identifiantProjet}`,
      {
        miseEnService: {
          date: dateMiseEnService,
          référenceDossierRaccordement,
        },
      },
    );
  }
};
