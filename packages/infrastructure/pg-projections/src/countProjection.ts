import format from 'pg-format';

import { Entity, CountOption } from '@potentiel-domain/entity';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { getWhereClause } from './getWhereClause';
import { getFromClause } from './getFromClause';

export const countProjection = async <TEntity extends Entity>(
  category: TEntity['type'],
  { where }: CountOption<TEntity> = {},
): Promise<number> => {
  const selectClause = 'SELECT COUNT(key) as total';
  const fromClause = getFromClause({});
  const [whereClause, whereValues] = getWhereClause({
    where,
    key: { operator: 'like', value: `${category}|%` },
  });
  const count = format(`${selectClause} ${fromClause} ${whereClause}`);

  const [{ total }] = await executeSelect<{ total: number }>(count, ...whereValues);

  return total;
};
