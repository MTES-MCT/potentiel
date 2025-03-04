import { Entity, OrderByOptions } from '@potentiel-domain/entity';
import { flatten } from '@potentiel-libraries/flat';

/**
 * Build the ORDER SQL clause based on `orderBy` options
 * @param projection can be used to specify on which projection to apply the ordering
 */
export const getOrderClause = <TEntity extends Entity>(
  orderBy: OrderByOptions<Omit<TEntity, 'type'>>,
) => {
  const flattenOrderBy = flatten<typeof orderBy, Record<string, 'ascending' | 'descending'>>(
    orderBy,
  );

  return `order by ${Object.entries(flattenOrderBy)
    .map(([key, value]) => `p1.value->>'${key}' ${value === 'ascending' ? 'ASC' : 'DESC'}`)
    .join(', ')}`;
};
