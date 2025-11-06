import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const tâcheRenouvelléeProjector = async ({
  payload: { identifiantProjet, typeTâche, ajoutéeLe },
}: Lauréat.Tâche.TâcheRenouvelléeEvent) => {
  await updateOneProjection<Lauréat.Tâche.TâcheEntity>(`tâche|${typeTâche}#${identifiantProjet}`, {
    typeTâche,
    miseÀJourLe: ajoutéeLe,
  });
};
