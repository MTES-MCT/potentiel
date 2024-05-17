import { Entity, ListOptionsV2, ListResultV2 } from '@potentiel-domain/core';
import { unflatten } from '@potentiel-libraries/flat';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import format from 'pg-format';
import { KeyValuePair } from './keyValuePair';
import { getWhereClause } from './getWhereClause';
import { getOrderClause } from './getOrderClause';
import { getRangeClause } from './getRangeClause';
import { countProjection } from './countProjection';

const selectQuery = 'SELECT key, value FROM domain_views.projection WHERE key ILIKE $1';

export const listProjectionV2 = async <TEntity extends Entity>(
  category: TEntity['type'],
  { orderBy, range, where }: ListOptionsV2<TEntity> = {},
): Promise<ListResultV2<TEntity>> => {
  const orderByClause = orderBy ? getOrderClause(orderBy) : '';
  const rangeClause = range ? getRangeClause(range) : '';
  const [whereClause, whereValues] = where ? getWhereClause(where) : ['', []];

  const select = format(`${selectQuery} ${whereClause} ${orderByClause} ${rangeClause}`);

  const result = await executeSelect<KeyValuePair<TEntity>>(
    select,
    `${category}|%`,
    ...whereValues,
  );
  const total = await countProjection(category, {
    where,
  });

  return {
    total,
    items: result.map(
      ({ key, value }) =>
        ({
          ...unflatten<unknown, Omit<TEntity, 'type'>>(value),
          type: key.split('|')[0],
        } as TEntity),
    ),
    range: range ?? {
      endPosition: total,
      startPosition: 0,
    },
  };
};
