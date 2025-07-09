import { match } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';

export const abandonDemandéProjector = async (
  event: Lauréat.Abandon.AbandonDemandéEvent | Lauréat.Abandon.AbandonDemandéEventV1,
) => {
  const {
    payload: { identifiantProjet },
  } = event;

  const estUneRecandidature = match(event)
    .with({ type: 'AbandonDemandé-V1' }, (event) => event.payload.recandidature)
    .otherwise(() => false);

  const appelOffre = await findProjection<AppelOffre.AppelOffreEntity>(
    `appel-offre|${IdentifiantProjet.convertirEnValueType(identifiantProjet).appelOffre}`,
  );
  if (Option.isNone(appelOffre)) {
    throw new Error("Appel d'offre non trouvé");
  }

  await upsertProjection<Lauréat.Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    identifiantProjet,
    demande: {
      pièceJustificative: event.payload.pièceJustificative,
      demandéLe: event.payload.demandéLe,
      demandéPar: event.payload.demandéPar,
      raison: event.payload.raison,
      estUneRecandidature,
      autoritéCompétente: appelOffre.abandon.autoritéCompétente,
      recandidature: estUneRecandidature
        ? {
            statut: Lauréat.Abandon.StatutPreuveRecandidature.enAttente.statut,
          }
        : undefined,
    },
    statut: Lauréat.Abandon.StatutAbandon.demandé.statut,
    misÀJourLe: event.payload.demandéLe,
  });
};
