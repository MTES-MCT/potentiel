import { flatten } from 'flat';

import { Entity } from '@potentiel-domain/entity';
import { executeQuery } from '@potentiel-libraries/pg-helpers';

const upsertQuery =
  'insert into domain_views.projection values($1, $2) on conflict (key) do update set value=$2';

export const upsertProjection = async <TProjection extends Entity>(
  id: `${TProjection['type']}|${string}`,
  readModel: Omit<TProjection, 'type'>,
): Promise<void> => {
  await executeQuery(upsertQuery, id, flatten(readModel, { safe: true }));
};
