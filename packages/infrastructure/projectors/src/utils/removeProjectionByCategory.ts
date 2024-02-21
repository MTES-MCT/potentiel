import { Projection } from '@potentiel-domain/entity';
import { executeQuery } from '@potentiel/pg-helpers';

export const removeProjectionByCategory = async <TProjection extends Projection>(
  category: `${TProjection['type']}`,
): Promise<void> => {
  await executeQuery(`delete from domain_views.projection where key like $1`, `${category}|%`);
};
