import { Entity, WhereOptions } from '@potentiel-domain/entity';
import { getWhereClause } from '@potentiel-infrastructure/pg-projection-read';
import { executeQuery } from '@potentiel-libraries/pg-helpers';

export const removeProjectionWhere = async <TProjection extends Entity>(
  category: TProjection['type'],
  where: WhereOptions<TProjection>,
): Promise<void> => {
  const [whereClause, whereValues] = getWhereClause({
    where,
    key: { operator: 'like', value: `${category}|%` },
  });
  const deleteQuery = `delete from domain_views.projection p ${whereClause}`;
  await executeQuery(deleteQuery, ...whereValues);
};
