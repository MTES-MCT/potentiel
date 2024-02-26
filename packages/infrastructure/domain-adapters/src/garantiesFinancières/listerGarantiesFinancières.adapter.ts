import format from 'pg-format';
import { executeSelect } from '@potentiel/pg-helpers';
import { ListerGarantiesFinancièresPort } from '@potentiel-domain/laureat/src/garantiesFinancières';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

const countGarantiesFinancièresQuery = `
  select count(key) as "totalItems"
  from domain_views.projection 
  where key like 'garanties-financieres|%'
`;

const getGarantiesFinancièresQuery = `
  select value
  from domain_views.projection 
  where key like 'garanties-financieres|%'
`;

export const listerGarantiesFinancièresAdapter: ListerGarantiesFinancièresPort = async ({
  where,
  pagination,
  région,
}) => {
  const whereClause = where
    ? format(
        Object.keys(where)
          .map((_, index) => `and value ->> %L = $${index + 1}`)
          .join(' '),
        ...Object.keys(where),
      )
    : '';

  const régionClause = région
    ? `and $${
        Object.keys(where).length + 1
      }  in (select jsonb_array_elements_text(value->'région'))`
    : '';

  const paginationClause = format(
    'limit %s offset %s',
    pagination.itemsPerPage,
    pagination.page <= 1 ? 0 : (pagination.page - 1) * pagination.itemsPerPage,
  );

  const query = `${getGarantiesFinancièresQuery} ${whereClause} ${régionClause} order by value->>'misÀJourLe' desc ${paginationClause}`;

  const result = await executeSelect<{
    value: GarantiesFinancières.GarantiesFinancièresEntity;
  }>(query, ...(where ? Object.values(where) : []).concat(région ? [région] : []));

  const countQuery = `${countGarantiesFinancièresQuery} ${whereClause} ${régionClause}`;
  const countResult = await executeSelect<{ totalItems: string }>(
    countQuery,
    ...(where ? Object.values(where) : []).concat(région ? [région] : []),
  );

  return {
    items: result.map((r) => r.value),
    currentPage: pagination?.page ?? 1,
    itemsPerPage: pagination?.itemsPerPage ?? result.length,
    totalItems: parseInt(countResult[0].totalItems),
  };
};
