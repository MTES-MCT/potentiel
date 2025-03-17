import { Entity } from '@potentiel-domain/entity';
import { executeQuery } from '@potentiel-libraries/pg-helpers';

const deleteQuery = 'delete from domain_views.projection where key = $1';

export const removeProjection = async <TProjection extends Entity>(
  id: `${TProjection['type']}|${string}`,
): Promise<void> => {
  await executeQuery(deleteQuery, id);
};
