import { executeSelect } from '@potentiel/pg-helpers';
import { ReadModel } from '@potentiel/core-domain';
import { KeyValuePair } from './keyValuePair';
import format from 'pg-format';

export const listProjection = async <TReadModel extends ReadModel>({
  type,
  orderBy,
}: {
  type: TReadModel['type'];
  orderBy?: keyof TReadModel;
}): Promise<ReadonlyArray<TReadModel>> => {
  const query = !orderBy
    ? `select key, value from app_views.projection where key like $1`
    : format(
        `select key, value from app_views.projection where key like $1 order by value ->> %L`,
        orderBy,
      );

  const result = await executeSelect<KeyValuePair<TReadModel['type'], TReadModel>>(
    query,
    `${type}|%`,
  );

  return result.map(
    ({ key, value }) =>
      ({
        type: key.split('|')[0],
        ...value,
      } as TReadModel),
  );
};
