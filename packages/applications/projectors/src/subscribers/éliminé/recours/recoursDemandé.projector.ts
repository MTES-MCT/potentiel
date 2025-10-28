import { Éliminé } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const recoursDemandéProjector = async ({
  payload: { identifiantProjet, demandéLe, demandéPar, raison, pièceJustificative },
}: Éliminé.Recours.RecoursDemandéEvent) => {
  await upsertProjection<Éliminé.Recours.RecoursEntity>(`recours|${identifiantProjet}`, {
    identifiantProjet,
    demande: {
      demandéLe,
      demandéPar,
      raison,
      pièceJustificative,
    },
    statut: Éliminé.Recours.StatutRecours.demandé.value,
    miseÀJourLe: demandéLe,
  });
};
