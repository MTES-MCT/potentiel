import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const nomProjetModifiéProjector = async ({
  payload: { identifiantProjet, nomProjet },
}: Lauréat.NomProjetModifiéEvent) => {
  await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    nomProjet,
  });
};
