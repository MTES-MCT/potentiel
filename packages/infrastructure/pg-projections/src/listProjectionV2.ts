import {
  Entity,
  LimitOptions,
  ListOptionsV2,
  ListResultV2,
  OrderByOptions,
} from '@potentiel-domain/core';
import { executeSelect } from '@potentiel-librairies/pg-helpers';
import { KeyValuePair } from './keyValuePair';
import { flatten, unflatten } from '@potentiel-librairies/flat-cjs';
import format from 'pg-format';

const selectQuery = 'SELECT key, value FROM domain_views.projection WHERE key LIKE $1';
const countQuery = 'SELECT COUNT(key) as total FROM domain_views.projection where key like $1';

export const listProjectionV2 = async <TEntity extends Entity>(
  category: TEntity['type'],
  { orderBy, limit }: ListOptionsV2<TEntity> = {},
): Promise<ListResultV2<TEntity>> => {
  const orderByClause = orderBy ? getOrderClause(orderBy) : '';
  const limitClause = limit ? getLimitClause(limit) : '';

  const select = format(`${selectQuery} ${orderByClause} ${limitClause}`);
  const count = format(`${countQuery}`);

  const result = await executeSelect<KeyValuePair<TEntity>>(select, `${category}|%`);
  const [{ total }] = await executeSelect<{ total: string }>(count, `${category}|%`);

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

const getLimitClause = ({ next, offset }: LimitOptions) =>
  format('limit %s offset %s', next, offset);
