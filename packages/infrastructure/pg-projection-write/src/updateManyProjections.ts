import { getWhereClause } from '@potentiel-infrastructure/pg-projection-read';
import { Entity, WhereOptions } from '@potentiel-domain/entity';
import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { getUpdateClause, DeepPartial } from './updateOneProjection.js';

/** */
export const updateManyProjections = async <TEntity extends Entity>(
  category: TEntity['type'],
  where: WhereOptions<Omit<TEntity, 'type'>>,
  update: DeepPartial<Omit<TEntity, 'type'>>,
): Promise<void> => {
  const [updateQuery, values] = getUpdateProjectionQuery(category, where, update);
  await executeQuery(updateQuery, ...values);
};

const getUpdateProjectionQuery = <TEntity extends Entity>(
  category: TEntity['type'],
  where: WhereOptions<Omit<TEntity, 'type'>>,
  update: DeepPartial<Omit<TEntity, 'type'>>,
): [string, Array<unknown>] => {
  const [whereClause, whereValues] = getWhereClause({
    where,
    key: { operator: 'like', value: `${category}|%` },
  });

  // shift variable index by the number of where Values
  const [updateClause, updateValues] = getUpdateClause<TEntity>(update, whereValues.length);

  return [`${updateClause} ${whereClause}`, [...whereValues, ...updateValues]];
};
