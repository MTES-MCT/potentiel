import format from 'pg-format';

import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Option } from '@potentiel-libraries/monads';
import { Entity, FindOptions } from '@potentiel-domain/entity';
import { unflatten } from '@potentiel-libraries/flat';

import { KeyValuePair } from './keyValuePair';
import { getSelectClause } from './getSelectClause';

const findQuery = 'from domain_views.projection where key = $1';

export const findProjection = async <TEntity extends Entity>(
  id: `${TEntity['type']}|${string}`,
  { select }: FindOptions<TEntity> = {},
): Promise<Option.Type<TEntity>> => {
  const selectQuery = getSelectClause(select);

  const find = format(`${selectQuery} ${findQuery}`);

  console.log(find);

  const result = await executeSelect<KeyValuePair<TEntity>>(find, id);

  if (result.length !== 1) {
    return Option.none;
  }

  console.log(result);

  const [{ key, value }] = result;

  return {
    type: key.split('|')[0] as TEntity['type'],
    ...unflatten<unknown, Omit<TEntity, 'type'>>(value),
  } as TEntity;
};
