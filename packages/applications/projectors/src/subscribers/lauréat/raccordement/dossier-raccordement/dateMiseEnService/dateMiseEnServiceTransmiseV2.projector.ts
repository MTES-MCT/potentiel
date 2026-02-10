import { DateTime } from '@potentiel-domain/common';
import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

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

  const dossiers = await listProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    'dossier-raccordement',
    {
      where: {
        identifiantProjet: Where.equal(identifiantProjet),
      },
    },
  );

  if (dossiers.items.length === 1) {
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
