import format from 'pg-format';

import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Option } from '@potentiel-libraries/monads';
import { Entity, FindOptions } from '@potentiel-domain/entity';
import { unflatten } from '@potentiel-libraries/flat';

import { KeyValuePair } from './keyValuePair';
import { getSelectClause } from './getSelectClause';
import { getFromClause } from './getFromClause';
import { getWhereClause } from './getWhereClause';

export const findProjection = async <TEntity extends Entity>(
  id: `${TEntity['type']}|${string}`,
  options?: FindOptions<TEntity>,
): Promise<Option.Type<TEntity>> => {
  const { select } = options ?? {};
  const selectClause = getSelectClause({ select });
  const fromClause = getFromClause({});
  const [whereClause, whereValues] = getWhereClause({ key: { operator: 'equal', value: id } });

  const find = format(`${selectClause} ${fromClause} ${whereClause}`);

  const result = await executeSelect<KeyValuePair<TEntity>>(find, ...whereValues);

  if (result.length !== 1) {
    return Option.none;
  }

  const [{ key, value }] = result;

  return {
    type: key.split('|')[0] as TEntity['type'],
    ...unflatten<unknown, Omit<TEntity, 'type'>>(value),
  } as TEntity;
};
