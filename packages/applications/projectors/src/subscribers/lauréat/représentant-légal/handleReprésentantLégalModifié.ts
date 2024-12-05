import { Lauréat, ReprésentantLégal } from '@potentiel-domain/laureat';

import { updateOneProjection } from '../../../infrastructure';

export const handleReprésentantLégalModifié = async ({
  payload: { identifiantProjet, nomReprésentantLégal, typeReprésentantLégal },
}: ReprésentantLégal.ReprésentantLégalModifiéEvent) => {
  await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    représentantLégal: {
      nom: nomReprésentantLégal,
      type: typeReprésentantLégal,
    },
  });
};
