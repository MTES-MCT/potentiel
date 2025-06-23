import format from 'pg-format';

import { Entity, Joined, ListOptions, ListResult, WhereCondition } from '@potentiel-domain/entity';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { KeyValuePair } from './keyValuePair';
import { getWhereClause } from './getWhereClause';
import { getOrderClause } from './getOrderClause';
import { getRangeClause } from './getRangeClause';
import { countProjection } from './countProjection';
import { getSelectClause } from './getSelectClause';
import { getFromClause } from './getFromClause';
import { mapResult } from './mapResult';

export const listProjection = async <TEntity extends Entity, TJoin extends Entity | {} = {}>(
  category: TEntity['type'],
  options?: ListOptions<TEntity, TJoin>,
): Promise<ListResult<TEntity, TJoin>> => {
  const { orderBy, range, where, join } = options ?? {};
  const selectClause = getSelectClause({ join: !!join });
  const fromClause = join ? getFromClause({ join }) : getFromClause({});
  const orderByClause = orderBy ? getOrderClause(orderBy) : '';
  const rangeClause = range ? getRangeClause(range) : '';
  const key: WhereCondition = { operator: 'like', value: `${category}|%` };
  const [whereClause, whereValues] = join
    ? getWhereClause({ key, where, join })
    : getWhereClause({ key, where });

  const select = format(
    `${selectClause} ${fromClause} ${whereClause} ${orderByClause} ${rangeClause}`,
  );

  const result = await executeSelect<KeyValuePair<TEntity> & { join_value?: string }>(
    select,
    ...whereValues,
  );

  const total = join
    ? await countProjection<TEntity, Entity>(category, { where, join })
    : await countProjection<TEntity>(category, { where });

  const items = result.map((item) =>
    join ? mapResult(item, { join }) : mapResult(item, {}),
  ) as (TEntity & Joined<TJoin>)[];

  return {
    total,
    items,
    range: range ?? {
      endPosition: total,
      startPosition: 0,
    },
  };
};
