import { DateTime } from '@potentiel-domain/common';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

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
};
