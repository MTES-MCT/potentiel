import { Lauréat } from '@potentiel-domain/projet';
import { createProjection } from '@potentiel-infrastructure/pg-projection-write';

export const représentantLégalImportéProjector = async ({
  payload: { identifiantProjet, nomReprésentantLégal },
}: Lauréat.ReprésentantLégal.ReprésentantLégalImportéEvent) =>
  createProjection<Lauréat.ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
    {
      identifiantProjet,
      nomReprésentantLégal,
      typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.inconnu.formatter(),
    },
  );
