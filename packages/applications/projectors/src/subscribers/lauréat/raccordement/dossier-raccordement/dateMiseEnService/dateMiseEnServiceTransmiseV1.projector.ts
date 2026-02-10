import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Where } from '@potentiel-domain/entity';

export const dateMiseEnServiceTransmiseV1Projector = async ({
  payload: { identifiantProjet, référenceDossierRaccordement, dateMiseEnService },
  created_at,
}: Lauréat.Raccordement.DateMiseEnServiceTransmiseV1Event & Event) => {
  await updateOneProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
    {
      miseEnService: {
        dateMiseEnService,
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

  console.log('dossiers', dossiers.items);

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
