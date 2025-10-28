import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const tâcheRenouvelléeProjector = async ({
  payload: { identifiantProjet, typeTâche, ajoutéeLe },
}: Lauréat.Tâche.TâcheRenouvelléeEvent) => {
  const tâche = await récupérerTâche(typeTâche, identifiantProjet);

  await upsertProjection<Lauréat.Tâche.TâcheEntity>(`tâche|${typeTâche}#${identifiantProjet}`, {
    ...tâche,
    typeTâche,
    miseÀJourLe: ajoutéeLe,
  });
};

const récupérerTâche = async (typeTâche: string, identifiantProjet: string) => {
  const tâcheEntity = await findProjection<Lauréat.Tâche.TâcheEntity>(
    `tâche|${typeTâche}#${identifiantProjet}`,
  );

  const tâcheDefaultEntity: Lauréat.Tâche.TâcheEntity = {
    identifiantProjet,
    typeTâche: Lauréat.Tâche.TypeTâche.inconnue.type,
    miseÀJourLe: DateTime.now().formatter(),
    type: 'tâche',
  };

  return Option.match(tâcheEntity)
    .some((value) => value)
    .none(() => tâcheDefaultEntity);
};
