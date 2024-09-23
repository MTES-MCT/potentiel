import { Entity } from '@potentiel-domain/entity';
import { flatten } from '@potentiel-libraries/flat';
import { executeQuery } from '@potentiel-libraries/pg-helpers';

const updateQuery =
  'update domain_views.projection set value=jsonb_set(value,$2,$3) where key = $1';

export const updateProjection = async <TProjection extends Entity>(
  id: `${TProjection['type']}|${string}`,
  readModel: Partial<Omit<TProjection, 'type'>>,
): Promise<void> => {
  const flatReadModel = Object.entries(flatten(readModel) as Record<string, unknown>);
  for (const [key, value] of flatReadModel) {
    await executeQuery(
      updateQuery,
      id,
      `{"${key}"}`,
      typeof value === 'string' ? `"${value}"` : value,
    );
  }
};
