import { ReadModel } from '@potentiel-domain/core-views';
import { executeQuery } from '@potentiel/pg-helpers';

export const removeProjection = async <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
): Promise<void> => {
  await executeQuery(`delete from domain_views.projection where key = $1`, id);
};
