import { Tâche } from '@potentiel-domain/tache';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const tâcheRelancéeProjector = async ({
  payload: { typeTâche, relancéeLe, identifiantProjet },
}: Tâche.TâcheRelancéeEvent) => {
  await updateOneProjection<Tâche.TâcheEntity>(`tâche|${typeTâche}#${identifiantProjet}`, {
    typeTâche,
    misÀJourLe: relancéeLe,
  });
};
