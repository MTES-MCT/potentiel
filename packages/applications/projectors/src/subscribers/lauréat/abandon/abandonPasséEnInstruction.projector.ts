import { Abandon } from '@potentiel-domain/laureat';

import { updateOneProjection } from '../../../infrastructure';

export const abandonPasséEnInstructionProjector = async ({
  payload: { identifiantProjet, passéEnInstructionLe, passéEnInstructionPar },
}: Abandon.AbandonPasséEnInstructionEvent) => {
  await updateOneProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    demande: {
      instruction: {
        passéEnInstructionLe: passéEnInstructionLe,
        passéEnInstructionPar: passéEnInstructionPar,
      },
    },
    statut: Abandon.StatutAbandon.enInstruction.statut,
    misÀJourLe: passéEnInstructionLe,
  });
};
