import { ReadModel } from '@potentiel/core-domain-views';
import { executeQuery } from '@potentiel/pg-helpers';

export const createProjection = async <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
  readModel: Omit<TReadModel, 'type'>,
): Promise<void> => {
  await executeQuery(`insert into domain_views.projection values($1, $2)`, id, readModel);
};
