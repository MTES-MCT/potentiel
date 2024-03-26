import format from 'pg-format';
import { executeSelect } from '@potentiel-librairies/pg-helpers';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

const getCountDépôtsEnCoursGarantiesFinancièresQuery = `
select count(key) as "totalItems"
from domain_views.projection 
where key like 'depot-en-cours-garanties-financieres|%'
`;

const getDépôtsEnCoursGarantiesFinancièressQuery = `
select value
from domain_views.projection 
where key like 'depot-en-cours-garanties-financieres|%'
`;

export const listerDépôtsEnCoursGarantiesFinancièresAdapter: GarantiesFinancières.ListerDépôtsEnCoursGarantiesFinancièresPort =
  async ({ where, pagination, région }) => {
    const whereClause =
      Object.keys(where).length > 0
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
        } in (select jsonb_array_elements_text(value->'régionProjet'))`
      : '';

    const paginationClause = format(
      'limit %s offset %s',
      pagination.itemsPerPage,
      pagination.page <= 1 ? 0 : (pagination.page - 1) * pagination.itemsPerPage,
    );

    const query = `${getDépôtsEnCoursGarantiesFinancièressQuery} ${whereClause} ${régionClause} order by value->>'misÀJourLe' desc ${paginationClause}`;
    const result = await executeSelect<{
      value: GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity;
    }>(query, ...(Object.values(where) || []).concat(région ? [région] : []));

    const countQuery = `${getCountDépôtsEnCoursGarantiesFinancièresQuery} ${whereClause} ${régionClause}`;
    const countResult = await executeSelect<{ totalItems: string }>(
      countQuery,
      ...(Object.values(where) || []).concat(région ? [région] : []),
    );

    return {
      items: result.map((r) => r.value),
      currentPage: pagination?.page ?? 1,
      itemsPerPage: pagination?.itemsPerPage ?? result.length,
      totalItems: parseInt(countResult[0].totalItems),
    };
  };
