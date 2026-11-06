import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const demandeDélaiRejetéeProjector = async (
  event: Lauréat.Délai.DemandeDélaiRejetéeEvent | Lauréat.Délai.DemandeDélaiRejetéeEventV1,
) => {
  const {
    payload: { identifiantProjet, dateDemande, rejetéeLe, rejetéePar, réponseSignée },
  } = event;

  const motif =
    event.type === 'DemandeDélaiRejetée-V1'
      ? Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement.motif
      : event.payload.motifDemande;

  await updateOneProjection<Lauréat.Délai.DemandeDélaiEntity>(
    `demande-délai|${identifiantProjet}#${motif}#${dateDemande}`,
    {
      statut: Lauréat.Délai.StatutDemandeDélai.rejeté.statut,
      miseÀJourLe: rejetéeLe,
      demande: {
        rejet: {
          rejetéLe: rejetéeLe,
          rejetéPar: rejetéePar,
          réponseSignée: { format: réponseSignée.format },
        },
      },
    },
  );
};
