import format from 'pg-format';

import { Entity, CountOption } from '@potentiel-domain/entity';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { getWhereClause } from './getWhereClause';
import { getFromClause } from './getFromClause';

export const countProjection = async <TEntity extends Entity, TJoin extends Entity | {} = {}>(
  category: TEntity['type'],
  options?: CountOption<TEntity, TJoin>,
): Promise<number> => {
  const { where, join } = options ?? {};
  const selectClause = 'SELECT COUNT(p1.key) as total';
  const fromClause = join ? getFromClause({ join }) : getFromClause({});
  const key = { operator: 'like', value: `${category}|%` } as const;
  const [whereClause, whereValues] = join
    ? getWhereClause({ where, key, join })
    : getWhereClause({ where, key });

  const count = format(`${selectClause} ${fromClause} ${whereClause}`);

  const [{ total }] = await executeSelect<{ total: number }>(count, ...whereValues);

  return total;
};
