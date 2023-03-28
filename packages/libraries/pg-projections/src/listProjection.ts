import { executeSelect } from '@potentiel/pg-helpers';
import { ReadModel, ListOptions } from '@potentiel/core-domain';
import { KeyValuePair } from './keyValuePair';

export const listProjection = async <TReadModel extends ReadModel>({
  type,
}: ListOptions<TReadModel>): Promise<ReadonlyArray<TReadModel>> => {
  const result = await executeSelect<KeyValuePair<TReadModel['type'], TReadModel>>(
    `SELECT "key", "value" FROM "PROJECTION" where "key" like $1`,
    `${type}#%`,
  );

  return result.map(
    ({ key, value }) =>
      ({
        type: key.split('#')[0],
        ...value,
      } as TReadModel),
  );
};
