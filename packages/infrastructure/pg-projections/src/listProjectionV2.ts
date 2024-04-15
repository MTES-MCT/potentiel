import {
  Entity,
  RangeOptions,
  ListOptionsV2,
  ListResultV2,
  OrderByOptions,
  WhereOperator,
  WhereOptions,
} from '@potentiel-domain/core';
import { flatten, unflatten } from '../../../libraries/flat/dist';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import format from 'pg-format';
import { KeyValuePair } from './keyValuePair';

const selectQuery = 'SELECT key, value FROM domain_views.projection WHERE key LIKE $1';
const countQuery = 'SELECT COUNT(key) as total FROM domain_views.projection where key like $1';

export const listProjectionV2 = async <TEntity extends Entity>(
  category: TEntity['type'],
  { orderBy, range, where }: ListOptionsV2<TEntity> = {},
): Promise<ListResultV2<TEntity>> => {
  const orderByClause = orderBy ? getOrderClause(orderBy) : '';
  const rangeClause = range ? getRangeClause(range) : '';
  const [whereClause, whereValues] = where ? getWhereClause(where) : ['', []];

  const select = format(`${selectQuery} ${whereClause} ${orderByClause} ${rangeClause}`);
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
    range: range ?? {
      endPosition: total,
      startPosition: 0,
    },
  };
};

const getRangeClause = ({ endPosition, startPosition }: RangeOptions) => {
  if (startPosition < 0) {
    throw new NegativeStartPositionError();
  }

  if (endPosition < 0) {
    throw new NegativeEndPositionError();
  }

  if (startPosition > endPosition) {
    throw new StartPositionGreaterThanEndPositionError();
  }

  if (startPosition === endPosition) {
    throw new StartPositionEqualToEndPositionError();
  }

  const limit = endPosition - startPosition + 1;
  const offset = startPosition;
  return format('limit %s offset %s', limit, offset);
};

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

export class NegativeStartPositionError extends Error {
  constructor() {
    super('Start position must be a positive value');
  }
}

export class NegativeEndPositionError extends Error {
  constructor() {
    super('End position must be a positive value');
  }
}

export class StartPositionGreaterThanEndPositionError extends Error {
  constructor() {
    super('Start position must be greater than end position value');
  }
}

export class StartPositionEqualToEndPositionError extends Error {
  constructor() {
    super('Start and end position values can not be the same');
  }
}
