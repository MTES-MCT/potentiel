import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Option } from '@potentiel-libraries/monads';
import { Entity } from '@potentiel-domain/core';

import { KeyValuePair } from './keyValuePair';
import { unflatten } from '@potentiel-libraries/flat-cjs';

export const findProjection = async <TProjection extends Entity>(
  id: `${TProjection['type']}|${string}`,
): Promise<Option.Type<TProjection>> => {
  const result = await executeSelect<KeyValuePair<TProjection['type'], TProjection>>(
    `select key, value from domain_views.projection where key = $1`,
    id,
  );

  if (result.length !== 1) {
    return Option.none;
  }

  const [{ key, value }] = result;

  return {
    type: key.split('|')[0] as TProjection['type'],
    ...unflatten<unknown, Omit<TProjection, 'type'>>(value),
  } as TProjection;
};
