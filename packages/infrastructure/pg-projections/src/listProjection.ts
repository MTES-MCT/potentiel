import format from 'pg-format';

import { Entity, Joined, ListOptions, ListResult } from '@potentiel-domain/entity';
import { unflatten } from '@potentiel-libraries/flat';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { KeyValuePair } from './keyValuePair';
import { getWhereClause } from './getWhereClause';
import { getOrderClause } from './getOrderClause';
import { getRangeClause } from './getRangeClause';
import { countProjection } from './countProjection';
import { getSelectClause } from './getSelectClause';
import { getFromClause } from './getFromClause';

export const listProjection = async <TEntity extends Entity, TJoin extends Entity | {} = {}>(
  category: TEntity['type'],
  options?: ListOptions<TEntity, TJoin>,
): Promise<ListResult<TEntity & Joined<TJoin>>> => {
  const { orderBy, range, where, join } = options ?? {};
  const selectClause = getSelectClause({ join: !!join });
  const fromClause = join ? getFromClause({ join }) : getFromClause({});
  const orderByClause = orderBy ? getOrderClause(orderBy) : '';
  const rangeClause = range ? getRangeClause(range) : '';
  const key = `${category}|%`;
  const [whereClause, whereValues] = join
    ? getWhereClause({ key, where, join })
    : getWhereClause({ key, where });

  const select = format(
    [selectClause, fromClause, whereClause, orderByClause, rangeClause].join(' '),
  );

  const result = await executeSelect<KeyValuePair<TEntity> & { join_value?: string }>(
    select,
    ...whereValues,
  );

  const total = await countProjection(category, { where });

  return {
    total,
    items: result.map(
      ({ key, value, join_value }) =>
        ({
          ...unflatten<unknown, Omit<TEntity, 'type'>>(value),
          type: key.split('|')[0],
          ...(join && join_value
            ? { [join.entity]: unflatten<unknown, Omit<TJoin, 'type'>>(join_value) }
            : {}),
        }) as TEntity & Joined<TJoin>,
    ),
    range: range ?? {
      endPosition: total,
      startPosition: 0,
    },
  };
};
