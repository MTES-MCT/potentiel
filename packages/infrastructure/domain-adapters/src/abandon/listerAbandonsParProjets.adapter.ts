import format from 'pg-format';
import { executeSelect } from '@potentiel/pg-helpers';
import { Abandon } from '@potentiel-domain/laureat';

const countAbandonsQuery = `
  select count(key) as "totalItems"
  from domain_views.projection 
  where key like 'abandon|%' and value->>'identifiantProjet' = any($1)
`;

const getAbandonsQuery = `
  select value
  from domain_views.projection 
  where key like 'abandon|%' and value->>'identifiantProjet' = any($1)
`;

export const listerAbandonParProjetsAdapter: Abandon.ListerAbandonsParProjetsPort = async (
  identifiantsProjets,
  filters,
  pagination,
) => {
  const whereClause = filters
    ? format(
        Object.keys(filters)
          .map((_, index) => `and value ->> %L = $${index + 2}`)
          .join(' '),
        ...Object.keys(filters),
      )
    : '';

  const paginationClause = format(
    'limit %s offset %s',
    pagination.itemsPerPage,
    pagination.page <= 1 ? 0 : (pagination.page - 1) * pagination.itemsPerPage,
  );

  const query = `${getAbandonsQuery} ${whereClause} order by value->>'misÀJourLe' ${paginationClause}`;

  const result = await executeSelect<{
    value: Abandon.AbandonProjection;
  }>(query, identifiantsProjets, ...(filters ? Object.values(filters) : []));

  const countQuery = `${countAbandonsQuery} ${whereClause}`;
  const countResult = await executeSelect<{ totalItems: string }>(
    countQuery,
    identifiantsProjets,
    ...(filters ? Object.values(filters) : []),
  );

  return {
    items: result.map((r) => r.value),
    currentPage: pagination?.page ?? 1,
    itemsPerPage: pagination?.itemsPerPage ?? result.length,
    totalItems: parseInt(countResult[0].totalItems),
  };
};
