import { TâcheEntity, TâcheRelancéeEvent } from '@potentiel-domain/tache';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const tâcheRelancéeProjector = async ({
  payload: { typeTâche, relancéeLe, identifiantProjet },
}: TâcheRelancéeEvent) => {
  await updateOneProjection<TâcheEntity>(`tâche|${typeTâche}#${identifiantProjet}`, {
    typeTâche,
    misÀJourLe: relancéeLe,
  });
};
