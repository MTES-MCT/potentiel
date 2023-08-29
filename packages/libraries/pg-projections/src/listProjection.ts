import { executeSelect } from '@potentiel/pg-helpers';
import { ReadModel } from '@potentiel/core-domain';
import { KeyValuePair } from './keyValuePair';
import format from 'pg-format';

export const listProjection = async <TReadModel extends ReadModel>({
  type,
  orderBy,
  where,
  pagination,
}: {
  type: TReadModel['type'];
  orderBy?: keyof TReadModel;
  where?: Partial<TReadModel>;
  pagination?: {
    page: number;
    itemsPerPage: number;
  };
}): Promise<ReadonlyArray<TReadModel>> => {
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

  return result.map(
    ({ key, value }) =>
      ({
        type: key.split('|')[0],
        ...value,
      } as TReadModel),
  );
};
