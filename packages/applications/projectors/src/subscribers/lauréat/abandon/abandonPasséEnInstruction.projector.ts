import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const abandonPasséEnInstructionProjector = async ({
  payload: { identifiantProjet, passéEnInstructionLe, passéEnInstructionPar },
}: Lauréat.Abandon.AbandonPasséEnInstructionEvent) => {
  await updateOneProjection<Lauréat.Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    demande: {
      instruction: {
        passéEnInstructionLe,
        passéEnInstructionPar,
      },
    },
    statut: Lauréat.Abandon.StatutAbandon.enInstruction.statut,
    miseÀJourLe: passéEnInstructionLe,
  });
};
