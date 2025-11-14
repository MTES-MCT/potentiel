import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

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
};
