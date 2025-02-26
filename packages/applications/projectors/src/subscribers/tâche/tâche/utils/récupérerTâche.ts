import { DateTime } from '@potentiel-domain/common';
import { TâcheEntity, TypeTâche } from '@potentiel-domain/tache';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';

export const récupérerTâche = async (typeTâche: string, identifiantProjet: string) => {
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
