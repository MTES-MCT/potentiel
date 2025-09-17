import format from 'pg-format';

import { Entity, CountOption, JoinOptions } from '@potentiel-domain/entity';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { getWhereClause } from './getWhereClause';
import { getFromClause } from './getFromClause';

export const countProjection = async <
  TEntity extends Entity,
  TJoin extends Entity | Entity[] | {} = {},
>(
  category: TEntity['type'],
  options?: CountOption<TEntity, TJoin>,
): Promise<number> => {
  const { where, join } = options ?? {};
  const selectClause = 'SELECT COUNT(p.key) as total';
  const joins = (Array.isArray(join) ? join : join ? [join] : []) as JoinOptions[];
  const fromClause = getFromClause({ joins });
  const key = { operator: 'like', value: `${category}|%` } as const;
  const [whereClause, whereValues] = getWhereClause({ where, key, joins });

  const count = format(`${selectClause} ${fromClause} ${whereClause}`);

  const [{ total }] = await executeSelect<{ total: number }>(count, ...whereValues);

  return total;
};
