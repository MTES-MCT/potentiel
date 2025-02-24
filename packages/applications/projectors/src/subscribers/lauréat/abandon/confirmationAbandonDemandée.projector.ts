import { Abandon } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';

import { updateOneProjection } from '../../../infrastructure';

import { getInfosAbandon } from './utils/getInfosAbandon';

export const confirmationAbandonDemandéeProjector = async ({
  payload: { identifiantProjet, confirmationDemandéeLe, confirmationDemandéePar, réponseSignée },
}: Abandon.ConfirmationAbandonDemandéeEvent) => {
  const abandonToUpsert = await getInfosAbandon(identifiantProjet);

  if (!abandonToUpsert) {
    getLogger().error(`Abandon non trouvé`, {
      identifiantProjet,
      fonction: 'confirmationAbandonDemandéeProjector',
    });
    return;
  }

  await updateOneProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
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
