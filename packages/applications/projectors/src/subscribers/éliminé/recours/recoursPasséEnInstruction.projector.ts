import { Recours } from '@potentiel-domain/elimine';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const recoursPasséEnInstructionProjector = async ({
  payload: { identifiantProjet, passéEnInstructionLe, passéEnInstructionPar },
}: Recours.RecoursPasséEnInstructionEvent) => {
  await updateOneProjection<Recours.RecoursEntity>(`recours|${identifiantProjet}`, {
    demande: {
      instruction: {
        passéEnInstructionLe,
        passéEnInstructionPar,
      },
    },
    statut: Recours.StatutRecours.enInstruction.value,
    misÀJourLe: passéEnInstructionLe,
  });
};
