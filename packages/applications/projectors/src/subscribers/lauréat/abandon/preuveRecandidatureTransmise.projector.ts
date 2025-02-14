import { Abandon } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';

import { upsertProjection } from '../../../infrastructure';

import { getInfosAbandon } from './utils/getInfosAbandon';

export const preuveCandidatureTransmiseProjector = async ({
  payload: { identifiantProjet, preuveRecandidature, transmiseLe, transmisePar },
}: Abandon.PreuveRecandidatureTransmiseEvent) => {
  const abandonToUpsert = await getInfosAbandon(identifiantProjet);

  // voir si on log l'erreur ou si c'est plus grave
  if (abandonToUpsert.demande.recandidature && abandonToUpsert.demande.recandidature.preuve) {
    await upsertProjection<Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
      ...abandonToUpsert,
      demande: {
        ...abandonToUpsert.demande,
        recandidature: {
          ...abandonToUpsert.demande.recandidature,
          statut: Abandon.StatutPreuveRecandidature.transmis.statut,
          preuve: {
            ...abandonToUpsert.demande.recandidature.preuve,
            identifiantProjet: preuveRecandidature,
            transmiseLe: transmiseLe,
            transmisePar: transmisePar,
          },
        },
      },
    });
  } else {
    getLogger().warn('Pas de preuve de recandidature demandée', { event });
  }
};
