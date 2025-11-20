import { Entity } from '@potentiel-domain/entity';
import { executeQuery } from '@potentiel-libraries/pg-helpers';

const deleteQuery = 'delete from domain_views.projection where key like $1';

export const removeProjectionByCategory = async <TProjection extends Entity>(
  category: TProjection['type'],
): Promise<void> => {
  await executeQuery(deleteQuery, `${category}|%`);
};
