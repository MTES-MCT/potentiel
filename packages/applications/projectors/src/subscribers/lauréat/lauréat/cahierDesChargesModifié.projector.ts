import { Lauréat } from '@potentiel-domain/laureat';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const cahierDesChargesModifiéProjector = async ({
  payload: { identifiantProjet, cahierDesCharges },
}: Lauréat.CahierDesChargesModifiéEvent) => {
  await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    cahierDesCharges,
  });
};
