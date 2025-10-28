import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const demandeDélaiPasséeEnInstructionProjector = async ({
  payload: { identifiantProjet, passéeEnInstructionLe, passéeEnInstructionPar, dateDemande },
}: Lauréat.Délai.DemandeDélaiPasséeEnInstructionEvent) => {
  await updateOneProjection<Lauréat.Délai.DemandeDélaiEntity>(
    `demande-délai|${identifiantProjet}#${dateDemande}`,
    {
      instruction: {
        passéeEnInstructionLe,
        passéeEnInstructionPar,
      },
      statut: Lauréat.Délai.StatutDemandeDélai.enInstruction.statut,
      miseÀJourLe: passéeEnInstructionLe,
    },
  );
};
