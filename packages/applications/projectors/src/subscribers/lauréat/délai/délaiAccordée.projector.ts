import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const délaiAccordéProjector = async ({
  payload: {
    identifiantProjet,
    accordéPar,
    accordéLe,
    nombreDeMois,
    dateAchèvementPrévisionnelCalculée,
    ...payload
  },
}: Lauréat.Délai.DélaiAccordéEvent) => {
  await updateOneProjection<Lauréat.Délai.DemandeDélaiEntity>(
    `demande-délai|${identifiantProjet}#${payload.dateDemande}`,
    {
      miseÀJourLe: accordéLe,
      statut: Lauréat.Délai.StatutDemandeDélai.accordé.statut,
      demande: {
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
