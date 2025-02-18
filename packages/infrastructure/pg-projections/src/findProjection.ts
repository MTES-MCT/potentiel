import format from 'pg-format';

import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Option } from '@potentiel-libraries/monads';
import { Entity, FindOptions, Joined } from '@potentiel-domain/entity';
import { unflatten } from '@potentiel-libraries/flat';

import { KeyValuePair } from './keyValuePair';
import { getSelectClause } from './getSelectClause';
import { getJoinClause } from './getJoinClause';

const baseFindClause = 'from domain_views.projection p1';
const whereClause = `where p1.key = $1`;

export const findProjection = async <TEntity extends Entity, TJoin extends Entity | {} = {}>(
  id: `${TEntity['type']}|${string}`,
  options?: FindOptions<TEntity, TJoin>,
): Promise<Option.Type<TEntity & Joined<TJoin>>> => {
  const { select, join } = options ?? {};
  const selectClause = getSelectClause(select, !!join);
  const fromClause = baseFindClause + (join ? getJoinClause<TEntity>(join) : '');

  const find = format(`${selectClause} ${fromClause} ${whereClause}`);
  console.log({ find });

  const result = await executeSelect<KeyValuePair<TEntity> & { join_value?: string }>(find, id);

  if (result.length !== 1) {
    return Option.none;
  }

  const [{ key, value, join_value }] = result;

  return {
    type: key.split('|')[0] as TEntity['type'],
    ...unflatten<unknown, Omit<TEntity, 'type'>>(value),
    ...(join && join_value
      ? { [join.projection]: unflatten<unknown, Omit<TJoin, 'type'>>(join_value) }
      : {}),
  } as TEntity & Joined<TJoin>;
};
