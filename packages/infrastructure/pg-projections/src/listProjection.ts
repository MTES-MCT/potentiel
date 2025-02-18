import format from 'pg-format';

import { Entity, Joined, ListOptions, ListResult } from '@potentiel-domain/entity';
import { unflatten } from '@potentiel-libraries/flat';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { KeyValuePair } from './keyValuePair';
import { getWhereClause } from './getWhereClause';
import { getOrderClause } from './getOrderClause';
import { getRangeClause } from './getRangeClause';
import { countProjection } from './countProjection';
import { getJoinClause } from './getJoinClause';

const baseSelectClause = 'select p1.key, p1.value';
const baseFromClause = 'from domain_views.projection p1';
const baseWhereClause = `where p1.key LIKE $1`;

export const listProjection = async <TEntity extends Entity, TJoin extends Entity | {} = {}>(
  category: TEntity['type'],
  options?: ListOptions<TEntity, TJoin>,
): Promise<ListResult<TEntity>> => {
  const { orderBy, range, where, join } = options ?? {};
  const orderByClause = orderBy ? getOrderClause(orderBy) : '';
  const rangeClause = range ? getRangeClause(range) : '';
  const [whereClause, whereValues] = where ? getWhereClause(where) : ['', []];
  const joinSelectClause = join ? `, p2.value as "join_value"` : '';
  const joinClause = join ? getJoinClause<TEntity>(join) : '';
  const selectQuery = `${baseSelectClause}${joinSelectClause} ${baseFromClause} ${joinClause} ${baseWhereClause}`;

  const select = format(`${selectQuery} ${whereClause} ${orderByClause} ${rangeClause}`);

  const result = await executeSelect<KeyValuePair<TEntity> & { join_value?: string }>(
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
      ({ key, value, join_value }) =>
        ({
          ...unflatten<unknown, Omit<TEntity, 'type'>>(value),
          type: key.split('|')[0],
          ...(join && join_value
            ? { [join.projection]: unflatten<unknown, Omit<TJoin, 'type'>>(join_value) }
            : {}),
        }) as TEntity & Joined<TJoin>,
    ),
    range: range ?? {
      endPosition: total,
      startPosition: 0,
    },
  };
};
