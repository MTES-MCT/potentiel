import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const siteDeProductionModifiéProjector = async ({
  payload: { identifiantProjet, localité },
}: Lauréat.SiteDeProductionModifiéEvent) => {
  await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
    localité,
  });
};
