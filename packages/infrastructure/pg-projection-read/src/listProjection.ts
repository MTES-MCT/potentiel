import format from 'pg-format';

import {
  Entity,
  JoinOptions,
  ListOptions,
  ListResult,
  WhereCondition,
} from '@potentiel-domain/entity';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { KeyValuePair } from './keyValuePair.js';
import { getWhereClause } from './getWhereClause.js';
import { getOrderClause } from './getOrderClause.js';
import { getRangeClause } from './getRangeClause.js';
import { countProjection } from './countProjection.js';
import { getSelectClause } from './getSelectClause.js';
import { getFromClause } from './getFromClause.js';
import { mapResult } from './mapResult.js';

export const listProjection = async <
  TEntity extends Entity,
  TJoin extends Entity | Entity[] | {} = {},
>(
  category: TEntity['type'],
  options?: ListOptions<TEntity, TJoin>,
): Promise<ListResult<TEntity, TJoin>> => {
  const { orderBy, range, where, join, select } = options ?? {};
  const joins = (Array.isArray(join) ? join : join ? [join] : []) as JoinOptions[];
  const selectClause = getSelectClause({
    joinCategories: joins.map((j) => j.entity),
    select,
  });

  const fromClause = getFromClause({ joins });
  const orderByClause = orderBy ? getOrderClause(orderBy) : '';
  const rangeClause = range ? getRangeClause(range) : '';
  const key: WhereCondition = { operator: 'like', value: `${category}|%` };
  const [whereClause, whereValues] = getWhereClause({ key, where, joins });

  const listQuery = format(
    `${selectClause} ${fromClause} ${whereClause} ${orderByClause} ${rangeClause}`,
  );

  const result = await executeSelect<
    KeyValuePair<TEntity> & { join_values?: { category: string; value: unknown }[] }
  >(listQuery, ...whereValues);

  const total = await countProjection<TEntity, Entity[]>(category, { where, join: joins });

  const items = result.map(mapResult<TEntity, TJoin>);

  return {
    total,
    items,
    range: range ?? {
      endPosition: total,
      startPosition: 0,
    },
  };
};
