import { ReadModel } from '@potentiel/core-domain';
import { executeQuery } from '@potentiel/pg-helpers';

export const removeProjection = async <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
): Promise<void> => {
  await executeQuery(`delete from app_views.projection where key = $1`, id);
};
