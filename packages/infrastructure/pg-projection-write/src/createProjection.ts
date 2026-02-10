import { flatten } from 'flat';

import { Entity } from '@potentiel-domain/entity';
import { executeQuery } from '@potentiel-libraries/pg-helpers';

const insertQuery = 'insert into domain_views.projection values($1, $2)';

export const createProjection = async <TProjection extends Entity>(
  id: `${TProjection['type']}|${string}`,
  readModel: Omit<TProjection, 'type'>,
): Promise<void> => {
  await executeQuery(insertQuery, id, flatten(readModel, { safe: true }));
};
