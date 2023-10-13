import { ReadModel } from '@potentiel/core-domain-views';
import { executeQuery } from '@potentiel/pg-helpers';

export const upsertProjection = async <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
  readModel: Omit<TReadModel, 'type'>,
): Promise<void> => {
  await executeQuery(
    `
    insert into domain_views.projection 
    values($1, $2)
    on conflict (key) 
    do update set value=$2`,
    id,
    readModel,
  );
};
