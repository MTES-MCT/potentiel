import { TâcheEntity, TâcheRelancéeEvent } from '@potentiel-domain/tache';

import { updateOneProjection } from '../../../infrastructure';

export const tâcheRelancéeProjector = async ({
  payload: { typeTâche, relancéeLe, identifiantProjet },
}: TâcheRelancéeEvent) => {
  await updateOneProjection<TâcheEntity>(`tâche|${typeTâche}#${identifiantProjet}`, {
    typeTâche: typeTâche,
    misÀJourLe: relancéeLe,
  });
};
