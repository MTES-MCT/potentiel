import { Abandon } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';

import { updateOneProjection } from '../../../infrastructure';

import { getInfosAbandon } from './utils/getInfosAbandon';

export const abandonPasséEnInstructionProjector = async ({
  payload: { identifiantProjet, instruitLe, instruitPar },
}: Abandon.AbandonPasséEnInstructionEvent) => {
  const abandonToUpsert = await getInfosAbandon(identifiantProjet);

  if (!abandonToUpsert) {
    getLogger().error(`Abandon non trouvé`, {
      identifiantProjet,
      fonction: 'abandonPasséEnInstructionProjector',
    });
    return;
  }

  await updateOneProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    demande: {
      ...abandonToUpsert.demande,
      instruction: {
        instruitLe: instruitLe,
        instruitPar: instruitPar,
      },
    },
    statut: Abandon.StatutAbandon.enInstruction.statut,
    misÀJourLe: instruitLe,
  });
};
