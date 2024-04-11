import { Entity, ListOptionsV2, ListResultV2, OrderByOptions } from '@potentiel-domain/core';
import { executeSelect } from '@potentiel-librairies/pg-helpers';
import { KeyValuePair } from './keyValuePair';
import { flatten, unflatten } from '@potentiel-librairies/flat-cjs';
import format from 'pg-format';

const selectQuery = 'SELECT key, value FROM domain_views.projection WHERE key LIKE $1';

export const listProjectionV2 = async <TEntity extends Entity>(
  category: TEntity['type'],
  { orderBy }: ListOptionsV2<TEntity> = {},
): Promise<ListResultV2<TEntity>> => {
  const query = format(`${selectQuery} ${orderBy ? getOrderClause(orderBy) : ''}`);

  const result = await executeSelect<KeyValuePair<TEntity>>(query, `${category}|%`);

  return {
    items: result.map(
      ({ key, value }) =>
        ({
          ...unflatten<unknown, Omit<TEntity, 'type'>>(value),
          type: key.split('|')[0],
        } as TEntity),
    ),
  };
};

const getOrderClause = <TEntity extends Entity>(orderBy: OrderByOptions<Omit<TEntity, 'type'>>) => {
  const flattenOrderBy = flatten<typeof orderBy, Record<string, 'ascending' | 'descending'>>(
    orderBy,
  );

  return `order by ${Object.entries(flattenOrderBy)
    .map(([key, value]) => `value->>'${key}' ${value === 'ascending' ? 'ASC' : 'DESC'}`)
    .join(', ')}`;
};
