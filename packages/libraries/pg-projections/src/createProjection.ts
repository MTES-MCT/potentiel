import { ReadModel } from '@potentiel/core-domain';
import { executeQuery } from '@potentiel/pg-helpers';

export const createProjection = async <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}#${string}`,
  readModel: Omit<TReadModel, 'type'>,
): Promise<void> => {
  console.log(id);
  await executeQuery(`INSERT INTO "PROJECTION"("key", "value") VALUES($1, $2)`, id, readModel);
};
