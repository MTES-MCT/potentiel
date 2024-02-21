import { Entity } from '@potentiel-domain/core';
import { executeQuery } from '@potentiel/pg-helpers';

export const createProjection = async <TProjection extends Entity>(
  id: `${TProjection['type']}|${string}`,
  readModel: Omit<TProjection, 'type'>,
): Promise<void> => {
  await executeQuery(`insert into domain_views.projection values($1, $2)`, id, readModel);
};
