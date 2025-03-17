import { Lauréat } from '@potentiel-domain/laureat';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const lauréatModifiéProjector = async ({
  payload: { identifiantProjet, nomProjet, localité },
}: Lauréat.LauréatModifiéEvent) => {
  await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    nomProjet,
    localité,
  });
};
