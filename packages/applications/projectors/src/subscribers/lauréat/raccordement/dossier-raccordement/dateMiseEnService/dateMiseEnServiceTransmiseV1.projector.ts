import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';

export const dateMiseEnServiceTransmiseV1Projector = async ({
  payload: { identifiantProjet, référenceDossierRaccordement, dateMiseEnService },
  created_at,
}: Lauréat.Raccordement.DateMiseEnServiceTransmiseV1Event & Event) => {
  const raccordementActuel = await findProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
  );

  await updateOneProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
    {
      miseEnService: {
        dateMiseEnService,
      },
      miseÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  );

  if (Option.isNone(raccordementActuel)) {
    return;
    // TODO : gérer le cas où le raccordement n'existe pas (est-ce possible ?)
  }
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

  if (dateMiseEnServiceTransmise.date.getTime() > dateMiseEnServiceActuelle.date.getTime()) {
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
