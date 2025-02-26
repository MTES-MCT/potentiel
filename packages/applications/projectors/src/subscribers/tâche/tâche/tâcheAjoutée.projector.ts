import { TâcheAjoutéeEvent, TâcheEntity } from '@potentiel-domain/tache';
import { getLogger } from '@potentiel-libraries/monitoring';

import { upsertProjection } from '../../../infrastructure';

import { récupérerProjet } from './utils/récupérerProjet';

export const tâcheAjoutéeProjector = async ({
  payload: { identifiantProjet, typeTâche, ajoutéeLe },
}: TâcheAjoutéeEvent) => {
  const projet = await récupérerProjet(identifiantProjet);

  if (!projet) {
    getLogger().warn(`Projet inconnu !`, { identifiantProjet: identifiantProjet });
  }

  await upsertProjection<TâcheEntity>(`tâche|${typeTâche}#${identifiantProjet}`, {
    identifiantProjet,
    projet,
    typeTâche: typeTâche,
    misÀJourLe: ajoutéeLe,
  });
};
