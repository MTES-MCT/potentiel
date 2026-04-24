import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const PPASignaléProjector = async ({
  payload: { identifiantProjet },
}: Lauréat.PPASignaléEvent) => {
  await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    PPA: true,
  });
};
