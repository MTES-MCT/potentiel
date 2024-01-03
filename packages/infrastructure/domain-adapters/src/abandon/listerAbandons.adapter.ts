import format from 'pg-format';
import { executeSelect } from '@potentiel/pg-helpers';
import { Abandon } from '@potentiel-domain/laureat';

const countAbandonsQuery = `
  select count(key) as "totalItems"
  from domain_views.projection 
  where key like 'abandon|%'
`;

const getAbandonsQuery = `
  select value
  from domain_views.projection 
  where key like 'abandon|%'
`;

export const listerAbandonsAdapter: Abandon.ListerAbandonsPort = async (
  filters,
  pagination,
  région,
) => {
  const whereClause = filters
    ? format(
        Object.keys(filters)
          .map((_, index) => `and value ->> %L = $${index + 1}`)
          .join(' '),
        ...Object.keys(filters),
      )
    : '';

  const régionClause = région
    ? `and $${
        Object.keys(filters).length + 1
      }  IN (SELECT jsonb_array_elements_text(value->'régionProjet'))`
    : '';

  const paginationClause = format(
    'limit %s offset %s',
    pagination.itemsPerPage,
    pagination.page <= 1 ? 0 : (pagination.page - 1) * pagination.itemsPerPage,
  );

  const query = `${getAbandonsQuery} ${whereClause} ${régionClause} order by value->>'misÀJourLe' desc ${paginationClause}`;

  const result = await executeSelect<{
    value: Abandon.AbandonProjection;
  }>(query, ...(filters ? Object.values(filters) : []).concat(région ? [région] : []));

  const countQuery = `${countAbandonsQuery} ${whereClause} ${régionClause}`;
  const countResult = await executeSelect<{ totalItems: string }>(
    countQuery,
    ...(filters ? Object.values(filters) : []).concat(région ? [région] : []),
  );

  return {
    items: result.map((r) => r.value),
    currentPage: pagination?.page ?? 1,
    itemsPerPage: pagination?.itemsPerPage ?? result.length,
    totalItems: parseInt(countResult[0].totalItems),
  };
};
