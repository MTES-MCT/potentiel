import { TâcheAchevéeEvent, TâcheEntity } from '@potentiel-domain/tache';

import { removeProjection } from '../../../infrastructure';

export const tâcheAchevéeProjector = async ({
  payload: { identifiantProjet, typeTâche },
}: TâcheAchevéeEvent) => {
  await removeProjection<TâcheEntity>(`tâche|${typeTâche}#${identifiantProjet}`);
};
