import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const StatutLauréatModifiéProjector = async ({
  payload: { identifiantProjet, statut },
}: Lauréat.StatutLauréatModifiéEvent) => {
  await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    statut,
  });
};
