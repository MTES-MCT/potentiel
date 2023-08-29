import { executeSelect } from '@potentiel/pg-helpers';
import { ReadModel, ListOptions, ListResult } from '@potentiel/core-domain';
import { KeyValuePair } from './keyValuePair';
import format from 'pg-format';

export const listProjection = async <TReadModel extends ReadModel>({
  type,
  orderBy,
  where,
  pagination,
}: ListOptions<TReadModel>): Promise<ListResult<TReadModel>> => {
  const baseQuery = `select key, value from domain_views.projection where key like $1`;

  const orderByClause = orderBy ? format(`order by value ->> %L`, orderBy) : '';

  const whereClause = where
    ? format(
        Object.keys(where)
          .map((_, index) => `and value ->> %L = $${index + 2}`)
          .join(' '),
        Object.keys(where),
      )
    : '';

  const paginationClause = pagination
    ? format(
        'limit %s offset %s',
        pagination.itemsPerPage,
        pagination.page <= 1 ? 0 : (pagination.page - 1) * pagination.itemsPerPage,
      )
    : '';

  const query = `${baseQuery} ${whereClause} ${orderByClause} ${paginationClause}`;
  const result = await executeSelect<KeyValuePair<TReadModel['type'], TReadModel>>(
    query,
    `${type}|%`,
    ...(where ? Object.values(where) : []),
  );

  const totalResult = pagination
    ? await executeSelect<{ totalItems: string }>(
        'select count(key) as "totalItems" from domain_views.projection where key like $1',
        `${type}|%`,
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
          ...value,
        } as TReadModel),
    ),
  };
};
