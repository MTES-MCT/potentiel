import { Recours } from '@potentiel-domain/elimine';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const recoursAnnuléProjector = async ({
  payload: { identifiantProjet },
}: Recours.RecoursAnnuléEvent) => {
  await removeProjection<Recours.RecoursEntity>(`recours|${identifiantProjet}`);
};
