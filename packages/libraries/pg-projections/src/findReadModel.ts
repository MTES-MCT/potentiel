import { executeSelect } from '@potentiel/pg-helpers';
import { ReadModelId, ReadModel } from '@potentiel/core-domain';
import { none, Option } from '@potentiel/monads';

export const findReadModel = async <TReadModel extends ReadModel>(
  id: ReadModelId,
): Promise<Option<TReadModel>> => {
  const result = await executeSelect<TReadModel>(
    `SELECT "value" FROM "PROJECTION" where "key" = $1`,
    id,
  );

  if (result.length !== 1) {
    return none;
  }

  return result[0];
};
