import { getLogger } from '@potentiel-libraries/monitoring';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';

import { getInfosAbandon } from './utils/getInfosAbandon';

export const preuveCandidatureDemandéeProjector = async ({
  payload: { identifiantProjet, demandéeLe },
}: Lauréat.Abandon.PreuveRecandidatureDemandéeEvent) => {
  const abandonToUpsert = await getInfosAbandon(identifiantProjet);

  if (!abandonToUpsert) {
    getLogger().error(`Abandon non trouvé`, {
      identifiantProjet,
      fonction: 'preuveCandidatureDemandéeProjector',
    });
    return;
  }

  if (abandonToUpsert.demande.recandidature) {
    await upsertProjection<Lauréat.Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
      ...abandonToUpsert,
      demande: {
        ...abandonToUpsert.demande,
        recandidature: {
          ...abandonToUpsert.demande.recandidature,
          statut: Lauréat.Abandon.StatutPreuveRecandidature.enAttente.statut,
          preuve: {
            demandéeLe,
          },
        },
      },
    });
  } else {
    getLogger().warn(`Pas de recandidature dans la demande d'abandon`, { identifiantProjet });
  }
};
