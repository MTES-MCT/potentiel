import { getLogger } from '@potentiel-libraries/monitoring';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';

import { getInfosAbandon } from './utils/getInfosAbandon';

export const preuveCandidatureTransmiseProjector = async ({
  payload: { identifiantProjet, preuveRecandidature, transmiseLe, transmisePar },
}: Lauréat.Abandon.PreuveRecandidatureTransmiseEvent) => {
  const abandonToUpsert = await getInfosAbandon(identifiantProjet);

  if (!abandonToUpsert) {
    getLogger().error(`Abandon non trouvé`, {
      identifiantProjet,
      fonction: 'preuveCandidatureTransmiseProjector',
    });
    return;
  }

  if (abandonToUpsert.demande.recandidature && abandonToUpsert.demande.recandidature.preuve) {
    await upsertProjection<Lauréat.Abandon.AbandonEntity>(`abandon|${identifiantProjet}`, {
      ...abandonToUpsert,
      demande: {
        ...abandonToUpsert.demande,
        recandidature: {
          ...abandonToUpsert.demande.recandidature,
          statut: Lauréat.Abandon.StatutPreuveRecandidature.transmis.statut,
          preuve: {
            ...abandonToUpsert.demande.recandidature.preuve,
            identifiantProjet: preuveRecandidature,
            transmiseLe,
            transmisePar,
          },
        },
      },
    });
  } else {
    getLogger().warn('Pas de preuve de recandidature demandée', { identifiantProjet });
  }
};
