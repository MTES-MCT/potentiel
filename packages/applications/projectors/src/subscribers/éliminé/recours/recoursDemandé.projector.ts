import { Recours } from '@potentiel-domain/elimine';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const recoursDemandéProjector = async ({
  payload: { identifiantProjet, demandéLe, demandéPar, raison, pièceJustificative },
}: Recours.RecoursDemandéEvent) => {
  await upsertProjection<Recours.RecoursEntity>(`recours|${identifiantProjet}`, {
    identifiantProjet,
    demande: {
      demandéLe,
      demandéPar,
      raison,
      pièceJustificative,
    },
    statut: Recours.StatutRecours.demandé.value,
    misÀJourLe: demandéLe,
  });
};
