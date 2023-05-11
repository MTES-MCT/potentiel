import { executeSelect } from '@potentiel/pg-helpers';
import { ReadModel, ListOptions } from '@potentiel/core-domain';
import { KeyValuePair } from './keyValuePair';
import format from 'pg-format';

export const listProjection = async <TReadModel extends ReadModel>({
  type,
  orderBy,
}: ListOptions<TReadModel>): Promise<ReadonlyArray<TReadModel>> => {
  const query = !orderBy
    ? `SELECT "key", "value" FROM "PROJECTION" where "key" like $1`
    : format(
        `SELECT "key", "value" FROM "PROJECTION" where "key" like $1 ORDER BY "value" ->> %L`,
        orderBy,
      );

  const result = await executeSelect<KeyValuePair<TReadModel['type'], TReadModel>>(
    query,
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
