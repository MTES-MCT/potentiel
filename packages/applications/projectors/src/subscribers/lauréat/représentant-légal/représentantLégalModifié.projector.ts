import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const représentantLégalModifiéProjector = async ({
  payload: { identifiantProjet, nomReprésentantLégal, typeReprésentantLégal },
}: ReprésentantLégal.ReprésentantLégalModifiéEvent) =>
  updateOneProjection<ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
    {
      nomReprésentantLégal,
      typeReprésentantLégal,
    },
  );
