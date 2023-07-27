import { executeSelect } from '@potentiel/pg-helpers';
import { ReadModel } from '@potentiel/core-domain';
import { none, Option } from '@potentiel/monads';
import { KeyValuePair } from './keyValuePair';

export const findProjection = async <TReadModel extends ReadModel>(
  id: `${TReadModel['type']}|${string}`,
): Promise<Option<TReadModel>> => {
  const result = await executeSelect<KeyValuePair<TReadModel['type'], TReadModel>>(
    `select key, value from domain_views.projection where key = $1`,
    id,
  );

  if (result.length !== 1) {
    return none;
  }

  const [{ key, value }] = result;
  return {
    type: key.split('|')[0] as TReadModel['type'],
    ...value,
  } as TReadModel;
};
