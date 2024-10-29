import { getWhereClause } from '@potentiel-infrastructure/pg-projections';
import { Entity, WhereOptions } from '@potentiel-domain/entity';
import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { getUpdateClause } from './updateOneProjection';

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

/** */
export const updateManyProjections = async <TEntity extends Entity>(
  category: TEntity['type'],
  where: WhereOptions<Omit<TEntity, 'type'>>,
  update: AtLeastOne<Omit<TEntity, 'type'>>,
): Promise<void> => {
  const [updateQuery, values] = getUpdateProjectionQuery(category, where, update);
  await executeQuery(updateQuery, ...values);
};

export const getUpdateProjectionQuery = <TEntity extends Entity>(
  category: TEntity['type'],
  where: WhereOptions<Omit<TEntity, 'type'>>,
  update: AtLeastOne<Omit<TEntity, 'type'>>,
): [string, Array<unknown>] => {
  const [whereClause, whereValues] = where ? getWhereClause(where) : ['', []];
  // shift variable index by the number of where Values, and add 1 for the key filter (category)
  const [updateClause, updateValues] = getUpdateClause<TEntity>(update, whereValues.length + 1);

  return [
    `${updateClause} where key like $1 ${whereClause}`,
    [`${category}|%`, ...whereValues, ...updateValues],
  ];
};
