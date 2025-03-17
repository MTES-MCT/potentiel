import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { createProjection } from '@potentiel-infrastructure/pg-projection-write';

export const représentantLégalImportéProjector = async ({
  payload: { identifiantProjet, nomReprésentantLégal },
}: ReprésentantLégal.ReprésentantLégalImportéEvent) =>
  createProjection<ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
    {
      identifiantProjet,
      nomReprésentantLégal,
      typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.inconnu.formatter(),
    },
  );
