import format from 'pg-format';

import type { CountOption, Entity, JoinOptions } from '@potentiel-domain/entity';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { getFromClause } from './getFromClause.js';
import { getWhereClause } from './getWhereClause.js';

export const countProjection = async <
  TEntity extends Entity,
  TJoin extends Entity | Entity[] | undefined = undefined,
>(
  category: TEntity['type'],
  options?: CountOption<TEntity, TJoin>,
): Promise<number> => {
  const { where, join, search } = options ?? {};
  const selectClause = 'SELECT COUNT(p.key) as total';
  const joins = (Array.isArray(join) ? join : join ? [join] : []) as JoinOptions[];
  const fromClause = getFromClause({ joins, search });
  const key = { operator: 'like', value: `${category}|%` } as const;
  const [whereClause, whereValues] = getWhereClause({ where, key, joins, search });

  const count = format(`${selectClause} ${fromClause} ${whereClause}`);

  const [{ total }] = await executeSelect<{ total: number }>(count, ...whereValues);

  return total;
};
