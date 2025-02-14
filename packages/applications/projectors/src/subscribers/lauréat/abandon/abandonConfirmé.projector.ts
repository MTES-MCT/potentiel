import { Abandon } from '@potentiel-domain/laureat';

import { upsertProjection } from '../../../infrastructure';

import { getInfosAbandon } from './utils/getInfosAbandon';

export const abandonConfirméProjector = async ({
  payload: { identifiantProjet, confirméLe, confirméPar },
}: Abandon.AbandonConfirméEvent) => {
  const abandonToUpsert = await getInfosAbandon(identifiantProjet);

  await upsertProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    ...abandonToUpsert,
    demande: {
      ...abandonToUpsert.demande,
      confirmation: {
        ...abandonToUpsert.demande.confirmation!,
        confirméLe: confirméLe,
        confirméPar: confirméPar,
      },
    },
    statut: Abandon.StatutAbandon.confirmé.statut,
    misÀJourLe: confirméLe,
  });
};
