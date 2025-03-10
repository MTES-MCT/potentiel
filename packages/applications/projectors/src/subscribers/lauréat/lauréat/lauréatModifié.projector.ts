import { Lauréat } from '@potentiel-domain/laureat';

import { updateOneProjection } from '../../../infrastructure';

export const lauréatModifiéProjector = async ({
  payload: { identifiantProjet, nomProjet, localité },
}: Lauréat.LauréatModifiéEvent) => {
  await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    nomProjet,
    localité,
  });
};
