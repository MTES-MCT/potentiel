import {
  Entity,
  LimitOptions,
  ListOptionsV2,
  ListResultV2,
  OrderByOptions,
  WhereOptions,
  isWhereOperator,
} from '@potentiel-domain/core';
import { flatten, unflatten } from '@potentiel-librairies/flat-cjs';
import { executeSelect } from '@potentiel-librairies/pg-helpers';
import format from 'pg-format';
import { KeyValuePair } from './keyValuePair';

const selectQuery = 'SELECT key, value FROM domain_views.projection WHERE key LIKE $1';
const countQuery = 'SELECT COUNT(key) as total FROM domain_views.projection where key like $1';

export const listProjectionV2 = async <TEntity extends Entity>(
  category: TEntity['type'],
  { orderBy, limit, where }: ListOptionsV2<TEntity> = {},
): Promise<ListResultV2<TEntity>> => {
  const orderByClause = orderBy ? getOrderClause(orderBy) : '';
  const limitClause = limit ? getLimitClause(limit) : '';
  const [whereClause, whereValues] = where ? getWhereClause(where) : ['', []];

  const select = format(`${selectQuery} ${whereClause} ${orderByClause} ${limitClause}`);
  const count = format(`${countQuery} ${whereClause}`);
  console.log(select);
  console.log(count);

  const result = await executeSelect<KeyValuePair<TEntity>>(
    select,
    `${category}|%`,
    ...whereValues,
  );
  const [{ total }] = await executeSelect<{ total: number }>(
    count,
    `${category}|%`,
    ...whereValues,
  );

  return {
    total,
    items: result.map(
      ({ key, value }) =>
        ({
          ...unflatten<unknown, Omit<TEntity, 'type'>>(value),
          type: key.split('|')[0],
        } as TEntity),
    ),
    limit: limit ?? {
      next: total,
      offset: 0,
    },
  };
};

const getOrderClause = <TEntity extends Entity>(orderBy: OrderByOptions<Omit<TEntity, 'type'>>) => {
  const flattenOrderBy = flatten<typeof orderBy, Record<string, 'ascending' | 'descending'>>(
    orderBy,
    {
      safe: true, // TODO : créer un helper pour ça, à la lecture c'est pas clair l'objectif
    },
  );

  return `order by ${Object.entries(flattenOrderBy)
    .map(([key, value]) => `value->>'${key}' ${value === 'ascending' ? 'ASC' : 'DESC'}`)
    .join(', ')}`;
};

const getWhereClause = <TEntity extends Entity>(
  where: WhereOptions<Omit<TEntity, 'type'>>,
): [clause: string, values: Array<unknown>] => {
  const flattenWhere = flatten<typeof where, Record<string, unknown>>(where, {
    safe: true, // TODO : créer un helper pour ça, à la lecture c'est pas clair l'objectif
  });
  const whereOperators = Object.entries(flattenWhere).filter(([key]) => key.endsWith('.operator'));

  const whereClause = format(
    whereOperators
      .map(
        ([_, value], index) => mapOperatorToSqlCondition(value as string, index), // TODO as c'est le mal !!!
      )
      .join(' '),
    ...whereOperators.map(([key]) => key.replace('.operator', '')),
  );

  const whereValues = Object.entries(flattenWhere)
    .filter(([key]) => key.endsWith('.value'))
    .map(([_, value]) => value);

  return [whereClause, whereValues];
};

const getLimitClause = ({ next, offset }: LimitOptions) =>
  format('limit %s offset %s', next, offset);

const mapOperatorToSqlCondition = (value: string, index: number) => {
  if (isWhereOperator(value)) {
    const baseCondition = 'and value->>%L';
    switch (value) {
      case 'equal':
        return `${baseCondition} = $${index + 2}`;
      case 'notEqual':
        return `${baseCondition} <> $${index + 2}`;
      case 'match':
        return `${baseCondition} ILIKE $${index + 2}`;
      case 'notMatch':
        return `${baseCondition} NOT ILIKE $${index + 2}`;
      case 'include':
        return `${baseCondition} = ANY($${index + 2})`;
      case 'notInclude':
        return `${baseCondition} <> ALL($${index + 2})`;
      default:
        // TODO: cas limite à traiter
        return '';
    }
  } else {
    return '';
  }
};
