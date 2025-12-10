import { Éliminé } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const recoursPasséEnInstructionProjector = async ({
  payload: { identifiantProjet, passéEnInstructionLe, passéEnInstructionPar },
}: Éliminé.Recours.RecoursPasséEnInstructionEvent) => {
  await updateOneProjection<Éliminé.Recours.RecoursEntity>(`demande-recours|${identifiantProjet}`, {
    demande: {
      instruction: {
        passéEnInstructionLe,
        passéEnInstructionPar,
      },
    },
    statut: Éliminé.Recours.StatutRecours.enInstruction.value,
    miseÀJourLe: passéEnInstructionLe,
  });
};
