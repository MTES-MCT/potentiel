import { ReadModel } from '@potentiel/core-domain';
import { executeQuery } from '@potentiel/pg-helpers';

export const updateProjection = async <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
  readModel: Omit<TReadModel, 'type'>,
): Promise<void> => {
  await executeQuery(`update domain_views.projection set value=$2 where key = $1`, id, readModel);
};
