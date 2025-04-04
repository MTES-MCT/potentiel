import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const cahierDesChargesChoisiProjector = async ({
  payload: { identifiantProjet, cahierDesCharges },
}: Lauréat.CahierDesChargesChoisiEvent) => {
  await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    cahierDesCharges,
  });
};
