import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const représentantLégalModifiéProjector = async ({
  payload: { identifiantProjet, nomReprésentantLégal, typeReprésentantLégal },
}: Lauréat.ReprésentantLégal.ReprésentantLégalModifiéEvent) =>
  updateOneProjection<ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
    {
      nomReprésentantLégal,
      typeReprésentantLégal,
    },
  );
