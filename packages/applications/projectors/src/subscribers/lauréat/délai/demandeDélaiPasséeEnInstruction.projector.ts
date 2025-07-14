import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const demandeDélaiPasséeEnInstructionProjector = async ({
  payload: { identifiantProjet, passéEnInstructionLe, passéEnInstructionPar, dateDemande },
}: Lauréat.Délai.DemandeDélaiPasséeEnInstructionEvent) => {
  await updateOneProjection<Lauréat.Délai.DemandeDélaiEntity>(
    `demande-délai|${identifiantProjet}#${dateDemande}`,
    {
      instruction: {
        passéEnInstructionLe,
        passéEnInstructionPar,
      },
      statut: Lauréat.Délai.StatutDemandeDélai.enInstruction.statut,
    },
  );
};
