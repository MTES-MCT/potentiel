import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const tâcheAchevéeProjector = async ({
  payload: { identifiantProjet, typeTâche },
}: Lauréat.Tâche.TâcheAchevéeEvent) => {
  await removeProjection<Lauréat.Tâche.TâcheEntity>(`tâche|${typeTâche}#${identifiantProjet}`);
};
