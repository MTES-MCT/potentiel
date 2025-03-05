import { Recours } from '@potentiel-domain/elimine';

import { updateOneProjection } from '../../../infrastructure';

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
