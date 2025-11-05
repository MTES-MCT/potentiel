import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const changementNomProjetEnregistréProjector = async ({
  payload: { identifiantProjet, nomProjet },
}: Lauréat.ChangementNomProjetEnregistréEvent) => {
  await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    nomProjet,
  });
};
