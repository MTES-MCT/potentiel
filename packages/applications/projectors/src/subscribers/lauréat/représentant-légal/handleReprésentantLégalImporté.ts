import { Lauréat, ReprésentantLégal } from '@potentiel-domain/laureat';

import { updateOneProjection } from '../../../infrastructure';

export const handleReprésentantLégalImporté = async ({
  payload: { identifiantProjet, nomReprésentantLégal },
}: ReprésentantLégal.ReprésentantLégalImportéEvent) => {
  await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    représentantLégal: {
      nom: nomReprésentantLégal,
      type: ReprésentantLégal.TypeReprésentantLégal.inconnu.formatter(),
    },
  });
};
