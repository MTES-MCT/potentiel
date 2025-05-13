import { Abandon } from '@potentiel-domain/laureat';
import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const abandonPasséEnInstructionProjector = async ({
  payload: { identifiantProjet, passéEnInstructionLe, passéEnInstructionPar },
}: Abandon.AbandonPasséEnInstructionEvent) => {
  await updateOneProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    demande: {
      instruction: {
        passéEnInstructionLe,
        passéEnInstructionPar,
      },
    },
    statut: Lauréat.Abandon.StatutAbandon.enInstruction.statut,
    misÀJourLe: passéEnInstructionLe,
  });
};
