import { TâcheEntity, TâcheRenouvelléeEvent } from '@potentiel-domain/tache';

import { upsertProjection } from '../../../infrastructure';

import { récupérerTâche } from './utils/récupérerTâche';

export const tâcheRenouvelléeProjector = async ({
  payload: { identifiantProjet, typeTâche, ajoutéeLe },
}: TâcheRenouvelléeEvent) => {
  const tâche = await récupérerTâche(typeTâche, identifiantProjet);

  await upsertProjection<TâcheEntity>(`tâche|${typeTâche}#${identifiantProjet}`, {
    ...tâche,
    typeTâche: typeTâche,
    misÀJourLe: ajoutéeLe,
  });
};
