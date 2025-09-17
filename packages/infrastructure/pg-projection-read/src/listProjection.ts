import format from 'pg-format';

import {
  Entity,
  Joined,
  JoinOptions,
  ListOptions,
  ListResult,
  WhereCondition,
} from '@potentiel-domain/entity';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { KeyValuePair } from './keyValuePair';
import { getWhereClause } from './getWhereClause';
import { getOrderClause } from './getOrderClause';
import { getRangeClause } from './getRangeClause';
import { countProjection } from './countProjection';
import { getSelectClause } from './getSelectClause';
import { getFromClause } from './getFromClause';
import { mapResult } from './mapResult';

export const listProjection = async <
  TEntity extends Entity,
  TJoin extends Entity | {} = {},
  TJoin2 extends Entity | {} = {},
>(
  category: TEntity['type'],
  options?: ListOptions<TEntity, TJoin, TJoin2>,
): Promise<ListResult<TEntity, TJoin>> => {
  const { orderBy, range, where, join } = options ?? {};
  const joins = (Array.isArray(join) ? join : join ? [join] : []) as JoinOptions[];
  const selectClause = getSelectClause({
    joinCategories: joins.map((j) => j.entity),
  });

  const fromClause = getFromClause({ joins });
  const orderByClause = orderBy ? getOrderClause(orderBy) : '';
  const rangeClause = range ? getRangeClause(range) : '';
  const key: WhereCondition = { operator: 'like', value: `${category}|%` };
  const [whereClause, whereValues] = getWhereClause({ key, where, joins });

  const select = format(
    `${selectClause} ${fromClause} ${whereClause} ${orderByClause} ${rangeClause}`,
  );

  const result = await executeSelect<
    KeyValuePair<TEntity> & { join_values: { category: string; value: unknown }[] }
  >(select, ...whereValues);

  // TODO simplify ?
  const total = join
    ? await countProjection<TEntity, Entity>(category, {
        where,
        join: Array.isArray(join) ? join[0] : join,
      })
    : await countProjection<TEntity>(category, { where });

  const items = result.map((item) => mapResult(item)) as (TEntity & Joined<TJoin & TJoin2>)[];

  return {
    total,
    items,
    range: range ?? {
      endPosition: total,
      startPosition: 0,
    },
  };
};
