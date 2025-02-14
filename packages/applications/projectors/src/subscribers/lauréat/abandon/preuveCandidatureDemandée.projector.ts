import { Abandon } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';

import { upsertProjection } from '../../../infrastructure';

import { getInfosAbandon } from './utils/getInfosAbandon';

export const preuveCandidatureDemandéeProjector = async ({
  payload: { identifiantProjet, demandéeLe },
}: Abandon.PreuveRecandidatureDemandéeEvent) => {
  const abandonToUpsert = await getInfosAbandon(identifiantProjet);

  // voir si on log l'erreur ou si c'est plus grave
  if (abandonToUpsert.demande.recandidature) {
    await upsertProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
      ...abandonToUpsert,
      demande: {
        ...abandonToUpsert.demande,
        recandidature: {
          ...abandonToUpsert.demande.recandidature,
          statut: Abandon.StatutPreuveRecandidature.enAttente.statut,
          preuve: {
            demandéeLe: demandéeLe,
          },
        },
      },
    });
  } else {
    getLogger().warn(`Pas de recandidature dans la demande d'abandon`, { event });
  }
};
