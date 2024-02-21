import { executeSelect } from '@potentiel/pg-helpers';
import { none, Option } from '@potentiel/monads';
import { Entity } from '@potentiel-domain/core';

import { KeyValuePair } from './keyValuePair';

export const findProjection = async <TProjection extends Entity>(
  id: `${TProjection['type']}|${string}`,
): Promise<Option<TProjection>> => {
  const result = await executeSelect<KeyValuePair<TProjection['type'], TProjection>>(
    `select key, value from domain_views.projection where key = $1`,
    id,
  );

  if (result.length !== 1) {
    return none;
  }

  const [{ key, value }] = result;
  return {
    type: key.split('|')[0] as TProjection['type'],
    ...value,
  } as TProjection;
};
