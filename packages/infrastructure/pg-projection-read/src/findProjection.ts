import format from 'pg-format';

import type { Entity, FindOptions, Joined } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { getFromClause } from './getFromClause';
import { getSelectClause } from './getSelectClause';
import { getWhereClause } from './getWhereClause';
import type { KeyValuePair } from './keyValuePair';
import { mapResult } from './mapResult';

export const findProjection = async <TEntity extends Entity, TJoin extends Entity | {} = {}>(
  id: `${TEntity['type']}|${string}`,
  options?: FindOptions<TEntity, TJoin>,
): Promise<Option.Type<TEntity & Joined<TJoin>>> => {
  const { select, join } = options ?? {};
  const selectClause = getSelectClause({ select, join: !!join });
  const fromClause = join ? getFromClause({ join }) : getFromClause({});
  const key = { operator: 'equal' as const, value: id };
  const [whereClause, whereValues] = join ? getWhereClause({ key, join }) : getWhereClause({ key });

  const find = format(`${selectClause} ${fromClause} ${whereClause}`);

  const result = await executeSelect<KeyValuePair<TEntity> & { join_value?: string }>(
    find,
    ...whereValues,
  );

  if (result.length !== 1) {
    return Option.none;
  }

  return join ? mapResult(result[0], { join }) : mapResult(result[0], {});
};
