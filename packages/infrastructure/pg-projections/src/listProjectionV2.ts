import {
  Entity,
  LimitOptions,
  ListOptionsV2,
  ListResultV2,
  OrderByOptions,
  WhereOptions,
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

  const result = await executeSelect<KeyValuePair<TEntity>>(
    select,
    `${category}|%`,
    ...whereValues,
  );
  const [{ total }] = await executeSelect<{ total: string }>(
    count,
    `${category}|%`,
    ...whereValues,
  );

  return {
    total: parseInt(total),
    items: result.map(
      ({ key, value }) =>
        ({
          ...unflatten<unknown, Omit<TEntity, 'type'>>(value),
          type: key.split('|')[0],
        } as TEntity),
    ),
  };
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
  const flattenWhere = flatten<typeof where, Record<string, unknown>>(where);
  const whereTypes = Object.entries(flattenWhere).filter(([key]) => key.endsWith('.type'));

  const whereClause = format(
    whereTypes
      .map(
        ([_, value], index) => `and value->>%L ${value === 'equal' ? '=' : 'ILIKE'} $${index + 2}`,
      )
      .join(' '),
    ...whereTypes.map(([key]) => key.replace('.type', '')),
  );

  const whereValues = Object.entries(flattenWhere)
    .filter(([key]) => key.endsWith('.value'))
    .map(([_, value]) => value);

  return [whereClause, whereValues];
};

const getLimitClause = ({ next, offset }: LimitOptions) =>
  format('limit %s offset %s', next, offset);
