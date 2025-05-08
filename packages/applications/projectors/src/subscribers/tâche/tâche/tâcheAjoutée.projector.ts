import { Tâche } from '@potentiel-domain/tache';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const tâcheAjoutéeProjector = async ({
  payload: { identifiantProjet, typeTâche, ajoutéeLe },
}: Tâche.TâcheAjoutéeEvent) => {
  await upsertProjection<Tâche.TâcheEntity>(`tâche|${typeTâche}#${identifiantProjet}`, {
    identifiantProjet,
    typeTâche,
    misÀJourLe: ajoutéeLe,
  });
};
