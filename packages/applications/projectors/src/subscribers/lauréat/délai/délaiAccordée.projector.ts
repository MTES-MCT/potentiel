import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

import { getAutoritéCompétente } from './_helpers/getAutoritéCompétente.js';

export const délaiAccordéProjector = async ({
  payload: {
    identifiantProjet,
    accordéPar,
    accordéLe,
    nombreDeMois,
    motif,
    dateAchèvementPrévisionnelCalculée,
    ...payload
  },
}: Lauréat.Délai.DélaiAccordéEvent) => {
  const autoritéCompétente = await getAutoritéCompétente(identifiantProjet, motif);
  await updateOneProjection<Lauréat.Délai.DemandeDélaiEntity>(
    `demande-délai|${identifiantProjet}#${payload.dateDemande}`,
    {
      miseÀJourLe: accordéLe,
      statut: Lauréat.Délai.StatutDemandeDélai.accordé.statut,
      autoritéCompétente,
      demande: {
        motif,
        accord: {
          réponseSignée: { format: payload.réponseSignée.format },
          accordéLe,
          accordéPar,
          nombreDeMois,
          dateAchèvementPrévisionnelCalculée,
        },
      },
    },
  );
};
