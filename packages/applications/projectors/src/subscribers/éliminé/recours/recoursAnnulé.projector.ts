import { Éliminé } from '@potentiel-domain/projet';
import {
  removeProjection,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const recoursAnnuléProjector = async ({
  payload: { identifiantProjet },
}: Éliminé.Recours.RecoursAnnuléEvent) => {
  await removeProjection<Éliminé.Recours.DemandeRecoursEntity>(
    `demande-recours|${identifiantProjet}`,
  );

  await updateOneProjection<Éliminé.Recours.RecoursEntity>(`recours|${identifiantProjet}`, {
    identifiantProjet,
    dernièreDemande: { statut: Éliminé.Recours.StatutRecours.annulé.value },
  });
};
