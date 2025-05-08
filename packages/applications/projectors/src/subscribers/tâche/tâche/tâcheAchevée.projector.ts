import { Tâche } from '@potentiel-domain/tache';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const tâcheAchevéeProjector = async ({
  payload: { identifiantProjet, typeTâche },
}: Tâche.TâcheAchevéeEvent) => {
  await removeProjection<Tâche.TâcheEntity>(`tâche|${typeTâche}#${identifiantProjet}`);
};
