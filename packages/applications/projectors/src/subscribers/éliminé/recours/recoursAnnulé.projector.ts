import { Éliminé } from '@potentiel-domain/projet';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const recoursAnnuléProjector = async ({
  payload: { identifiantProjet },
}: Éliminé.Recours.RecoursAnnuléEvent) => {
  await removeProjection<Éliminé.Recours.RecoursEntity>(`demande-recours|${identifiantProjet}`);
};
