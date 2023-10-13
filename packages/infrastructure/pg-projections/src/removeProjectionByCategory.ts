import { ReadModel } from '@potentiel-domain/core-views';
import { executeQuery } from '@potentiel/pg-helpers';

export const removeProjectionByCategory = async <TReadModel extends ReadModel>(
  category: `${TReadModel['type']}`,
): Promise<void> => {
  await executeQuery(`delete from domain_views.projection where key like $1`, `${category}|%`);
};
