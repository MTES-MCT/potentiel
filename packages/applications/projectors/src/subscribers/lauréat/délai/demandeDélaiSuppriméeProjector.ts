import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const demandeDélaiSuppriméeProjector = async (
  event: Lauréat.Délai.DemandeDélaiSuppriméeEvent | Lauréat.Délai.DemandeDélaiSuppriméeEventV1,
) => {
  const {
    payload: { identifiantProjet, dateDemande },
  } = event;

  const motif =
    event.type === 'DemandeDélaiSupprimée-V1'
      ? Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement.motif
      : event.payload.motifDemande;

  await removeProjection<Lauréat.Délai.DemandeDélaiEntity>(
    `demande-délai|${identifiantProjet}#${motif}#${dateDemande}`,
  );
};
