import { Entity } from '@potentiel-domain/core';
import { executeQuery } from '@potentiel-librairies/pg-helpers';
import { flatten } from '@potentiel-librairies/flat-cjs';

const updateQuery = 'update domain_views.projection set value=$2 where key = $1';

export const updateProjection = async <TProjection extends Entity>(
  id: `${TProjection['type']}|${string}`,
  readModel: Omit<TProjection, 'type'>,
): Promise<void> => {
  await executeQuery(updateQuery, id, flatten(readModel, { safe: true }));
};
