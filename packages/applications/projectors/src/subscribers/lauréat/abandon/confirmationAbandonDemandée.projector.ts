import { Abandon } from '@potentiel-domain/laureat';

import { upsertProjection } from '../../../infrastructure';

import { getInfosAbandon } from './utils/getInfosAbandon';

export const confirmationAbandonDemandéeProjector = async ({
  payload: { identifiantProjet, confirmationDemandéeLe, confirmationDemandéePar, réponseSignée },
}: Abandon.ConfirmationAbandonDemandéeEvent) => {
  const abandonToUpsert = await getInfosAbandon(identifiantProjet);

  await upsertProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    ...abandonToUpsert,
    demande: {
      ...abandonToUpsert.demande,
      confirmation: {
        demandéeLe: confirmationDemandéeLe,
        demandéePar: confirmationDemandéePar,
        réponseSignée: {
          format: réponseSignée.format,
        },
      },
    },
    statut: Abandon.StatutAbandon.confirmationDemandée.statut,
    misÀJourLe: confirmationDemandéeLe,
  });
};
