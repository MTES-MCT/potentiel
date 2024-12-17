import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { updateOneProjection } from '../../../infrastructure';

export const handleReprésentantLégalModifié = async ({
  payload: { identifiantProjet, nomReprésentantLégal, typeReprésentantLégal },
}: ReprésentantLégal.ReprésentantLégalModifiéEvent) =>
  updateOneProjection<ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
    {
      nomReprésentantLégal,
      typeReprésentantLégal,
    },
  );
