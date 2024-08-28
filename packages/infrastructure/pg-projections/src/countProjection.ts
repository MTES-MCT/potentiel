import format from 'pg-format';

import { Entity, CountOption } from '@potentiel-domain/entity';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { getWhereClause } from './getWhereClause';

const countQuery = 'SELECT COUNT(key) as total FROM domain_views.projection where key like $1';

export const countProjection = async <TEntity extends Entity>(
  category: TEntity['type'],
  { where }: CountOption<TEntity> = {},
): Promise<number> => {
  const [whereClause, whereValues] = where ? getWhereClause(where) : ['', []];
  const count = format(`${countQuery} ${whereClause}`);

  const [{ total }] = await executeSelect<{ total: number }>(
    count,
    `${category}|%`,
    ...whereValues,
  );

  return total;
};
