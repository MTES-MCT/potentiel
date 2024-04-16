import { Entity, OrderByOptions } from '@potentiel-domain/core';
import { flatten } from '../../../libraries/flat/dist';

export const getOrderClause = <TEntity extends Entity>(
  orderBy: OrderByOptions<Omit<TEntity, 'type'>>,
) => {
  const flattenOrderBy = flatten<typeof orderBy, Record<string, 'ascending' | 'descending'>>(
    orderBy,
  );

  return `order by ${Object.entries(flattenOrderBy)
    .map(([key, value]) => `value->>'${key}' ${value === 'ascending' ? 'ASC' : 'DESC'}`)
    .join(', ')}`;
};
