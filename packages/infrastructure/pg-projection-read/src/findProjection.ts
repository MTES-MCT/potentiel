import format from 'pg-format';

import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Option } from '@potentiel-libraries/monads';
import { Entity, FindOptions, Joined, JoinOptions } from '@potentiel-domain/entity';

import { KeyValuePair } from './keyValuePair.js';
import { getSelectClause } from './getSelectClause.js';
import { getFromClause } from './getFromClause.js';
import { getWhereClause } from './getWhereClause.js';
import { mapResult } from './mapResult.js';

export const findProjection = async <TEntity extends Entity, TJoin extends Entity | {} = {}>(
  id: `${TEntity['type']}|${string}`,
  options?: FindOptions<TEntity, TJoin>,
): Promise<Option.Type<TEntity & Joined<TJoin>>> => {
  const { select, join } = options ?? {};
  const joins = (Array.isArray(join) ? join : join ? [join] : []) as JoinOptions[];
  const selectClause = getSelectClause({ select, joinCategories: joins.map((j) => j.entity) });
  const fromClause = getFromClause({ joins });
  const key = { operator: 'equal' as const, value: id };
  const [whereClause, whereValues] = getWhereClause({ key, joins });

  const find = format(`${selectClause} ${fromClause} ${whereClause}`);

  const result = await executeSelect<
    KeyValuePair<TEntity> & { join_values?: { category: string; value: unknown }[] }
  >(find, ...whereValues);

  if (result.length !== 1) {
    return Option.none;
  }

  return mapResult(result[0]);
};
