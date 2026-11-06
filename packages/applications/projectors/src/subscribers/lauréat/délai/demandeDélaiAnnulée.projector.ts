import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const demandeDélaiAnnuléeProjector = async (
  event: Lauréat.Délai.DemandeDélaiAnnuléeEvent | Lauréat.Délai.DemandeDélaiAnnuléeEventV1,
) => {
  const { identifiantProjet, dateDemande, annuléLe } = event.payload;

  const motif =
    event.type === 'DemandeDélaiAnnulée-V1'
      ? Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement.motif
      : event.payload.motifDemande;

  await updateOneProjection<Lauréat.Délai.DemandeDélaiEntity>(
    `demande-délai|${identifiantProjet}#${motif}#${dateDemande}`,
    {
      miseÀJourLe: annuléLe,
      statut: Lauréat.Délai.StatutDemandeDélai.annulé.statut,
    },
  );
};
