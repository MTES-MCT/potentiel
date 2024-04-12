import {
  Entity,
  LimitOptions,
  ListOptionsV2,
  ListResultV2,
  OrderByOptions,
  WhereOperator,
  WhereOptions,
} from '@potentiel-domain/core';
import { flatten, unflatten } from '../../../libraries/flat/dist';
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

const getLimitClause = ({ next, offset }: LimitOptions) =>
  format('limit %s offset %s', next, offset);

const getOrderClause = <TEntity extends Entity>(orderBy: OrderByOptions<Omit<TEntity, 'type'>>) => {
  const flattenOrderBy = flatten<typeof orderBy, Record<string, 'ascending' | 'descending'>>(
    orderBy,
  );

  return `order by ${Object.entries(flattenOrderBy)
    .map(([key, value]) => `value->>'${key}' ${value === 'ascending' ? 'ASC' : 'DESC'}`)
    .join(', ')}`;
};

const getWhereClause = <TEntity extends Entity>(
  where: WhereOptions<Omit<TEntity, 'type'>>,
): [clause: string, values: Array<unknown>] => {
  const rawWhere = flatten<typeof where, Record<string, unknown>>(where);

  const clause = mapToWhereClause(getWhereOperators(rawWhere));
  const values = getWhereValues(rawWhere);

  return [clause, values];
};

const getWhereValues = (flattenWhere: Record<string, unknown>) =>
  Object.entries(flattenWhere)
    .filter(([key]) => key.endsWith('.value'))
    .map(([_, value]) => value);

const getWhereOperators = (flattenWhere: Record<string, unknown>) =>
  Object.entries(flattenWhere)
    .filter(([key]) => key.endsWith('.operator'))
    .map(([key, value]) => {
      return {
        name: key.replace('.operator', ''),
        operator: value as WhereOperator,
      };
    });

const mapToWhereClause = (operators: Array<{ name: string; operator: WhereOperator }>) =>
  format(
    operators.map(({ operator }, index) => mapOperatorToSqlCondition(operator, index)).join(' '),
    ...operators.map(({ name }) => name),
  );

const mapOperatorToSqlCondition = (value: WhereOperator, index: number) => {
  const baseCondition = 'and value->>%L';
  switch (value) {
    case 'equal':
      return `${baseCondition} = $${index + 2}`;
    case 'notEqual':
      return `${baseCondition} <> $${index + 2}`;
    case 'like':
      return `${baseCondition} ILIKE $${index + 2}`;
    case 'notLike':
      return `${baseCondition} NOT ILIKE $${index + 2}`;
    case 'include':
      return `${baseCondition} = ANY($${index + 2})`;
    case 'notInclude':
      return `${baseCondition} <> ALL($${index + 2})`;
  }
};
