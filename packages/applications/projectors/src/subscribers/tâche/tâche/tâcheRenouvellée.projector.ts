import { TâcheEntity, TâcheRenouvelléeEvent } from '@potentiel-domain/tache';
import { getLogger } from '@potentiel-libraries/monitoring';

import { upsertProjection } from '../../../infrastructure';

import { récupérerProjet } from './utils/récupérerProjet';
import { récupérerTâche } from './utils/récupérerTâche';

export const tâcheRenouvelléeProjector = async ({
  payload: { identifiantProjet, typeTâche, ajoutéeLe },
}: TâcheRenouvelléeEvent) => {
  const projet = await récupérerProjet(identifiantProjet);

  if (!projet) {
    getLogger().warn(`Projet inconnu !`, { identifiantProjet: identifiantProjet });
  }

  const tâche = await récupérerTâche(typeTâche, identifiantProjet);

  await upsertProjection<TâcheEntity>(`tâche|${typeTâche}#${identifiantProjet}`, {
    ...tâche,
    typeTâche: typeTâche,
    misÀJourLe: ajoutéeLe,
  });
};
