import { match } from 'ts-pattern';
import { mediator } from 'mediateur';

import { CahierDesCharges, Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
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

  const cahierDesCharges = await mediator.send<Lauréat.ConsulterCahierDesChargesQuery>({
    type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesCharges',
    data: {
      identifiantProjetValue: identifiantProjet,
    },
  });

  if (Option.isNone(cahierDesCharges)) {
    throw new Error('Cahier des charges non trouvé');
  }

  await upsertProjection<Lauréat.Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    identifiantProjet,
    demande: {
      pièceJustificative: event.payload.pièceJustificative,
      demandéLe: event.payload.demandéLe,
      demandéPar: event.payload.demandéPar,
      raison: event.payload.raison,
      estUneRecandidature,
      autoritéCompétente: CahierDesCharges.bind(cahierDesCharges).getAutoritéCompétente('abandon'),
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
