import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const tâcheAjoutéeProjector = async ({
  payload: { identifiantProjet, typeTâche, ajoutéeLe },
}: Lauréat.Tâche.TâcheAjoutéeEvent) => {
  await upsertProjection<Lauréat.Tâche.TâcheEntity>(`tâche|${typeTâche}#${identifiantProjet}`, {
    identifiantProjet,
    typeTâche,
    misÀJourLe: ajoutéeLe,
  });
};
