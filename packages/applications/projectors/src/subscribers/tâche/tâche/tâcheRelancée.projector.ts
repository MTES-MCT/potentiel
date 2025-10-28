import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const tâcheRelancéeProjector = async ({
  payload: { typeTâche, relancéeLe, identifiantProjet },
}: Lauréat.Tâche.TâcheRelancéeEvent) => {
  await updateOneProjection<Lauréat.Tâche.TâcheEntity>(`tâche|${typeTâche}#${identifiantProjet}`, {
    typeTâche,
    miseÀJourLe: relancéeLe,
  });
};
