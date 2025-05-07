import { Tâche } from '@potentiel-domain/tache';
import { DateTime } from '@potentiel-domain/common';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const tâcheRenouvelléeProjector = async ({
  payload: { identifiantProjet, typeTâche, ajoutéeLe },
}: Tâche.TâcheRenouvelléeEvent) => {
  const tâche = await récupérerTâche(typeTâche, identifiantProjet);

  await upsertProjection<Tâche.TâcheEntity>(`tâche|${typeTâche}#${identifiantProjet}`, {
    ...tâche,
    typeTâche,
    misÀJourLe: ajoutéeLe,
  });
};

const récupérerTâche = async (typeTâche: string, identifiantProjet: string) => {
  const tâcheEntity = await findProjection<Tâche.TâcheEntity>(
    `tâche|${typeTâche}#${identifiantProjet}`,
  );

  const tâcheDefaultEntity: Tâche.TâcheEntity = {
    identifiantProjet,
    typeTâche: Tâche.TypeTâche.inconnue.type,
    misÀJourLe: DateTime.now().formatter(),
    type: 'tâche',
  };

  return Option.match(tâcheEntity)
    .some((value) => value)
    .none(() => tâcheDefaultEntity);
};
