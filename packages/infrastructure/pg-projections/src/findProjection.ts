import format from 'pg-format';

import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Option } from '@potentiel-libraries/monads';
import { Entity, FindOptions } from '@potentiel-domain/entity';
import { unflatten } from '@potentiel-libraries/flat';

import { KeyValuePair } from './keyValuePair';
import { getSelectClause } from './getSelectClause';
import { getWhereClause } from './getWhereClause';

const findQuery = 'from domain_views.projection where key = $1';

export const findProjection = async <TEntity extends Entity>(
  id: `${TEntity['type']}|${string}`,
  { select, where }: FindOptions<TEntity> = {},
): Promise<Option.Type<TEntity>> => {
  const selectQuery = getSelectClause(select);
  const [whereClause, whereValues] = where ? getWhereClause(where) : ['', []];

  const find = format(`${selectQuery} ${findQuery} ${whereClause}`);

  const result = await executeSelect<KeyValuePair<TEntity>>(find, id, ...whereValues);

  if (result.length !== 1) {
    return Option.none;
  }

  const [{ key, value }] = result;

  return {
    type: key.split('|')[0] as TEntity['type'],
    ...unflatten<unknown, Omit<TEntity, 'type'>>(value),
  } as TEntity;
};
