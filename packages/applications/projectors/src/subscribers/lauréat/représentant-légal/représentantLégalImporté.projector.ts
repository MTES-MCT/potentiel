import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { createProjection } from '../../../infrastructure';

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
