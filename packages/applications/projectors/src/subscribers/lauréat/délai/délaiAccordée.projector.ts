import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const délaiAccordéProjector = async (
  event: Lauréat.Délai.DélaiAccordéEvent | Lauréat.Délai.DélaiAccordéEventV1,
) => {
  const {
    accordéLe,
    accordéPar,
    identifiantProjet,
    dateDemande,
    réponseSignée,
    nombreDeMois,
    dateAchèvementPrévisionnelCalculée,
  } = event.payload;

  const motif =
    event.type === 'DélaiAccordé-V1'
      ? Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement.motif
      : event.payload.motifDemande;

  await updateOneProjection<Lauréat.Délai.DemandeDélaiEntity>(
    `demande-délai|${identifiantProjet}#${motif}#${dateDemande}`,
    {
      miseÀJourLe: accordéLe,
      statut: Lauréat.Délai.StatutDemandeDélai.accordé.statut,
      demande: {
        motif,
        accord: {
          réponseSignée: { format: réponseSignée.format },
          accordéLe,
          accordéPar,
          nombreDeMois,
          dateAchèvementPrévisionnelCalculée,
        },
      },
    },
  );
};
