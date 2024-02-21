import { Entity } from '@potentiel-domain/core';
import { executeQuery } from '@potentiel/pg-helpers';

export const removeProjection = async <TProjection extends Entity>(
  id: `${TProjection['type']}|${string}`,
): Promise<void> => {
  await executeQuery(`delete from domain_views.projection where key = $1`, id);
};
