import { executeSelect } from '@potentiel/pg-helpers';
import { ReadModel } from '@potentiel/core-domain';
import { KeyValuePair } from './keyValuePair';

export const searchProjection = async <TReadModel extends ReadModel>(
  searchKeyExpression: string,
): Promise<
  ReadonlyArray<{
    key: string;
    readModel: TReadModel;
  }>
> => {
  const query = `SELECT "key", "value" FROM "PROJECTION" where "key" like $1`;

  const result = await executeSelect<KeyValuePair<TReadModel['type'], TReadModel>>(
    query,
    searchKeyExpression,
  );

  return result.map(({ key, value }) => ({
    key,
    readModel: {
      type: key.split('|')[0],
      ...value,
    } as TReadModel,
  }));
};
