import { TypeTâche, TâcheEntity, TâcheRenouvelléeEvent } from '@potentiel-domain/tache';
import { DateTime } from '@potentiel-domain/common';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';

import { upsertProjection } from '../../../infrastructure';

export const tâcheRenouvelléeProjector = async ({
  payload: { identifiantProjet, typeTâche, ajoutéeLe },
}: TâcheRenouvelléeEvent) => {
  const tâche = await récupérerTâche(typeTâche, identifiantProjet);

  await upsertProjection<TâcheEntity>(`tâche|${typeTâche}#${identifiantProjet}`, {
    ...tâche,
    typeTâche: typeTâche,
    misÀJourLe: ajoutéeLe,
  });
};

const récupérerTâche = async (typeTâche: string, identifiantProjet: string) => {
  const tâcheEntity = await findProjection<TâcheEntity>(`tâche|${typeTâche}#${identifiantProjet}`);

  const tâcheDefaultEntity: TâcheEntity = {
    identifiantProjet,
    typeTâche: TypeTâche.inconnue.type,
    misÀJourLe: DateTime.now().formatter(),
    type: 'tâche',
  };

  return Option.match(tâcheEntity)
    .some((value) => value)
    .none(() => tâcheDefaultEntity);
};
