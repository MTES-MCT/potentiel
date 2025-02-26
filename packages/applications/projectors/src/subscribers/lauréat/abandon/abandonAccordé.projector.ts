import { Abandon } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';

import { updateOneProjection } from '../../../infrastructure';

import { getInfosAbandon } from './utils/getInfosAbandon';

export const abandonAccordéProjector = async ({
  payload: { identifiantProjet, accordéLe, accordéPar, réponseSignée },
}: Abandon.AbandonAccordéEvent) => {
  const abandonToUpsert = await getInfosAbandon(identifiantProjet);

  if (!abandonToUpsert) {
    getLogger().error(`Abandon non trouvé`, {
      identifiantProjet,
      fonction: 'abandonAccordéProjector',
    });
    return;
  }

  await updateOneProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
    demande: {
      ...abandonToUpsert.demande,
      accord: {
        accordéLe: accordéLe,
        accordéPar: accordéPar,
        réponseSignée: {
          format: réponseSignée.format,
        },
      },
    },
    statut: Abandon.StatutAbandon.accordé.statut,
    misÀJourLe: accordéLe,
  });
};
