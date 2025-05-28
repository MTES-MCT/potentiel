import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';
import { AbandonBen } from '@potentiel-domain/laureat';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const abandonDemandéProjector = async (
  event: Lauréat.Abandon.AbandonDemandéEvent | Lauréat.Abandon.AbandonDemandéEventV1,
) => {
  const {
    payload: { identifiantProjet },
  } = event;

  const estUneRecandidature = match(event)
    .with({ type: 'AbandonDemandé-V1' }, (event) => event.payload.recandidature)
    .otherwise(() => false);

  await upsertProjection<AbandonBen.AbandonEntity>(`abandon|${identifiantProjet}`, {
    identifiantProjet,
    demande: {
      pièceJustificative: event.payload.pièceJustificative,
      demandéLe: event.payload.demandéLe,
      demandéPar: event.payload.demandéPar,
      raison: event.payload.raison,
      estUneRecandidature,
      recandidature: estUneRecandidature
        ? {
            statut: AbandonBen.StatutPreuveRecandidature.enAttente.statut,
          }
        : undefined,
    },
    statut: Lauréat.Abandon.StatutAbandon.demandé.statut,
    misÀJourLe: event.payload.demandéLe,
  });
};
