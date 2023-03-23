import { executeQuery } from '@potentiel/pg-helpers';
import { ReadModelId, ReadModel } from '@potentiel/core-domain';

export const createReadModel = async <TReadModel extends ReadModel>(
  id: ReadModelId,
  readModel: TReadModel,
): Promise<void> => {
  await executeQuery(`INSERT INTO "PROJECTION"("key", "value") VALUES($1, $2)`, id, readModel);
};
