import { Éliminé } from '@potentiel-domain/projet';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const recoursAnnuléProjector = async ({
  payload: { identifiantProjet },
}: Éliminé.Recours.RecoursAnnuléEvent) => {
  await removeProjection<Éliminé.Recours.DemandeRecoursEntity>(
    `demande-recours|${identifiantProjet}`,
  );
};
