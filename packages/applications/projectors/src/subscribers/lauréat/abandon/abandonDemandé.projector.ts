import { match } from 'ts-pattern';

import { Abandon } from '@potentiel-domain/laureat';

import { upsertProjection } from '../../../infrastructure';
import { getProjectData } from '../_utils/getProjectData';

export const abandonDemandéProjector = async (
  event: Abandon.AbandonDemandéEvent | Abandon.AbandonDemandéEventV1,
) => {
  const {
    payload: { identifiantProjet },
  } = event;

  const projet = await getProjectData(identifiantProjet);

  const estUneRecandidature = match(event)
    .with({ type: 'AbandonDemandé-V1' }, (event) => event.payload.recandidature)
    .otherwise(() => false);

  await upsertProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    identifiantProjet,
    projet,
    demande: {
      pièceJustificative: event.payload.pièceJustificative,
      demandéLe: event.payload.demandéLe,
      demandéPar: event.payload.demandéPar,
      raison: event.payload.raison,
      estUneRecandidature,
      recandidature: estUneRecandidature
        ? {
            statut: Abandon.StatutPreuveRecandidature.enAttente.statut,
          }
        : undefined,
    },
    statut: Abandon.StatutAbandon.demandé.statut,
    misÀJourLe: event.payload.demandéLe,
  });
};
