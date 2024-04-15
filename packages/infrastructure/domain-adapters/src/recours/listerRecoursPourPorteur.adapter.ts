import format from 'pg-format';
import { executeSelect } from '@potentiel-librairies/pg-helpers';
import { Recours } from '@potentiel-domain/elimine';

const countRecoursQuery = `
  select count(key) as "totalItems"
  from domain_views.projection 
  inner join (
    select distinct p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE" as project_id
    from "projects" p
    inner join "UserProjects" up on p.id = up."projectId"
    inner join "users" u on up."userId" = u.id
    where p."notifiedOn" > 0 and u."email" = $1
) as project_ids on value->>'identifiantProjet' = project_ids.project_id
where key like 'recours|%'
`;

const getRecoursQuery = `
select value
from domain_views.projection 
inner join (
    select distinct p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId" || '#' || p."numeroCRE" as project_id
    from "projects" p
    inner join "UserProjects" up on p.id = up."projectId"
    inner join "users" u on up."userId" = u.id
    where p."notifiedOn" > 0 and u."email" = $1
) as project_ids on value->>'identifiantProjet' = project_ids.project_id
where key like 'recours|%'
`;

export const listerRecoursPourPorteurAdapter: Recours.ListerRecoursPourPorteurPort = async ({
  identifiantUtilisateur,
  where,
  pagination,
}) => {
  const whereClause = where
    ? format(
        Object.keys(where)
          .map((_, index) => `and value ->> %L = $${index + 2}`)
          .join(' '),
        ...Object.keys(where),
      )
    : '';

  const paginationClause = format(
    'limit %s offset %s',
    pagination.itemsPerPage,
    pagination.page <= 1 ? 0 : (pagination.page - 1) * pagination.itemsPerPage,
  );

  const query = `${getRecoursQuery} ${whereClause} order by value->>'misÀJourLe' desc ${paginationClause}`;

  const result = await executeSelect<{
    value: Recours.RecoursEntity;
  }>(query, identifiantUtilisateur, ...(where ? Object.values(where) : []));

  const countQuery = `${countRecoursQuery} ${whereClause}`;
  const countResult = await executeSelect<{ totalItems: string }>(
    countQuery,
    identifiantUtilisateur,
    ...(where ? Object.values(where) : []),
  );

  return {
    items: result.map((r) => r.value),
    currentPage: pagination?.page ?? 1,
    itemsPerPage: pagination?.itemsPerPage ?? result.length,
    totalItems: parseInt(countResult[0].totalItems),
  };
};
