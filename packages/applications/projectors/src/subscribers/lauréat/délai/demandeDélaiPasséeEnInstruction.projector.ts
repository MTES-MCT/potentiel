import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const demandeDélaiPasséeEnInstructionProjector = async (
  event:
    | Lauréat.Délai.DemandeDélaiPasséeEnInstructionEvent
    | Lauréat.Délai.DemandeDélaiPasséeEnInstructionEventV1,
) => {
  const {
    payload: { identifiantProjet, passéeEnInstructionLe, passéeEnInstructionPar, dateDemande },
  } = event;

  const motif =
    event.type === 'DemandeDélaiPasséeEnInstruction-V1'
      ? Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement.motif
      : event.payload.motifDemande;

  await updateOneProjection<Lauréat.Délai.DemandeDélaiEntity>(
    `demande-délai|${identifiantProjet}#${motif}#${dateDemande}`,
    {
      statut: Lauréat.Délai.StatutDemandeDélai.enInstruction.statut,
      miseÀJourLe: passéeEnInstructionLe,
      demande: {
        instruction: {
          passéeEnInstructionLe,
          passéeEnInstructionPar,
        },
      },
    },
  );
};
