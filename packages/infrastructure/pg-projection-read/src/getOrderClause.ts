import { flatten } from 'flat';

import { Entity, OrderByOptions } from '@potentiel-domain/entity';

/**
 * Build the ORDER SQL clause based on `orderBy` options
 * @param projection can be used to specify on which projection to apply the ordering
 */
export const getOrderClause = <TEntity extends Entity>(
  orderBy: OrderByOptions<Omit<TEntity, 'type'>>,
) => {
  const flattenOrderBy = flatten<typeof orderBy, Record<string, 'ascending' | 'descending'>>(
    orderBy,
    { safe: true },
  );

  return `order by ${Object.entries(flattenOrderBy)
    .map(([key, value]) => `p.value->>'${key}' ${value === 'ascending' ? 'ASC' : 'DESC'}`)
    .join(', ')}`;
};
