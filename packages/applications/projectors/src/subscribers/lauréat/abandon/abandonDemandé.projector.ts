import { match } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { getCahierDesCharges } from '../utils/getCahierDesCharges';

export const abandonDemandéProjector = async (
  event: Lauréat.Abandon.AbandonDemandéEvent | Lauréat.Abandon.AbandonDemandéEventV1,
) => {
  const {
    payload: { identifiantProjet },
  } = event;

  const estUneRecandidature = match(event)
    .with({ type: 'AbandonDemandé-V1' }, (event) => event.payload.recandidature)
    .otherwise(() => false);

  const cahierDesCharges = await getCahierDesCharges(
    IdentifiantProjet.convertirEnValueType(identifiantProjet),
  );

  if (!cahierDesCharges) {
    throw new Error(`Le cahier des charges du projet ${identifiantProjet} est introuvable.`);
  }

  await upsertProjection<Lauréat.Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    identifiantProjet,
    demandéLe: event.payload.demandéLe,
    demandeEnCours: true,
    estAbandonné: false,
  });

  await upsertProjection<Lauréat.Abandon.DemandeAbandonEntity>(
    `demande-abandon|${identifiantProjet}#${event.payload.demandéLe}`,
    {
      identifiantProjet,
      demande: {
        pièceJustificative: event.payload.pièceJustificative,
        demandéLe: event.payload.demandéLe,
        demandéPar: event.payload.demandéPar,
        raison: event.payload.raison,
        estUneRecandidature,
        autoritéCompétente:
          cahierDesCharges.getRèglesChangements('abandon').autoritéCompétente ??
          Lauréat.Abandon.AutoritéCompétente.DEFAULT_AUTORITE_COMPETENTE_ABANDON,
        recandidature: estUneRecandidature
          ? {
              statut: Lauréat.Abandon.StatutPreuveRecandidature.enAttente.statut,
            }
          : undefined,
      },
      statut: Lauréat.Abandon.StatutAbandon.demandé.statut,
      miseÀJourLe: event.payload.demandéLe,
    },
  );
};
