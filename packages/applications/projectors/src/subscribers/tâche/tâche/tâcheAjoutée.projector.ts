import { TâcheAjoutéeEvent, TâcheEntity } from '@potentiel-domain/tache';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const tâcheAjoutéeProjector = async ({
  payload: { identifiantProjet, typeTâche, ajoutéeLe },
}: TâcheAjoutéeEvent) => {
  await upsertProjection<TâcheEntity>(`tâche|${typeTâche}#${identifiantProjet}`, {
    identifiantProjet,
    typeTâche: typeTâche,
    misÀJourLe: ajoutéeLe,
  });
};
