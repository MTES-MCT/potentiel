import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { KeyValuePair } from './keyValuePair';
import format from 'pg-format';
import { Entity, ListOptions, ListResult } from '@potentiel-domain/core';
import { unflatten } from '@potentiel-libraries/flat';

const selectQuery = 'select key, value from domain_views.projection where key like $1';

export const listProjection = async <TProjection extends Entity>({
  type,
  orderBy,
  where,
  pagination,
}: ListOptions<TProjection>): Promise<ListResult<TProjection>> => {
  const orderByClause = orderBy
    ? format(`order by value ->> %L ${orderBy.ascending ? 'asc' : 'desc'}`, orderBy.property)
    : '';

  const whereClause = where
    ? format(
        Object.keys(where)
          .map((_, index) => `and value ->> %L like $${index + 2}`)
          .join(' '),
        ...Object.keys(where),
      )
    : '';

  const paginationClause = pagination
    ? format(
        'limit %s offset %s',
        pagination.itemsPerPage,
        pagination.page <= 1 ? 0 : (pagination.page - 1) * pagination.itemsPerPage,
      )
    : '';

  const query = `${selectQuery} ${whereClause} ${orderByClause} ${paginationClause}`;
  const result = await executeSelect<KeyValuePair<TProjection>>(
    query,
    `${type}|%`,
    ...(where ? Object.values(where) : []),
  );

  const totalResult = pagination
    ? await executeSelect<{ totalItems: string }>(
        `select count(key) as "totalItems" from domain_views.projection where key like $1 ${whereClause}`,
        `${type}|%`,
        ...(where ? Object.values(where) : []),
      )
    : [{ totalItems: result.length.toString() }];

  return {
    currentPage: pagination?.page ?? 1,
    itemsPerPage: pagination?.itemsPerPage ?? result.length,
    totalItems: parseInt(totalResult[0].totalItems),
    items: result.map(
      ({ key, value }) =>
        ({
          type: key.split('|')[0],
          ...unflatten<unknown, Omit<TProjection, 'type'>>(value),
        } as TProjection),
    ),
  };
};
