import format from 'pg-format';
import {
  RécupérerNombreTâchePort,
  RécupérerTâchesPort,
  TâcheProjection,
} from '@potentiel-domain/tache';
import { executeSelect } from '@potentiel/pg-helpers';
import { récupérerIdentifiantProjectsParPorteurAdapter } from '../projet/récupérerIdentifiantProjectsParPorteur';

const countNombreTâcheQuery = `
  select json_build_object(
    'nombreTâches', 
    sum(CAST(value->'nombreTâches' as numeric))
  ) as value 
  from domain_views.projection 
  where 
    key = any($1) and 
    CAST(value->'nombreTâches' as numeric) > 0;
`;

export const récupérerNombreTâcheAdapter: RécupérerNombreTâchePort = async (email) => {
  const projects = await récupérerIdentifiantProjectsParPorteurAdapter(email);

  const identifiants = projects.map(
    ({ appelOffre, numéroCRE, période, famille }) =>
      `nombre-de-tâches|${appelOffre}#${période}#${famille}#${numéroCRE}`,
  );

  const nombreTâches = await executeSelect<{
    value: {
      nombreTâches: number;
    };
  }>(countNombreTâcheQuery, identifiants);

  if (!nombreTâches.length) {
    return 0;
  }

  return nombreTâches[0].value.nombreTâches ?? 0;
};

const getTâchesQuery = `
  select value
  from domain_views.projection 
  where key like 'tâche|%' and value->>'identifiantProjet' = any($1)
`;

const countTâchesQuery = `
  select count(key) as "totalItems"
  from domain_views.projection 
  where key like 'tâche|%' and value->>'identifiantProjet' = any($1)
`;

export const récupérerTâchesAdapter: RécupérerTâchesPort = async (email, filters, pagination) => {
  const identifiants = await récupérerIdentifiantProjectsParPorteurAdapter(email);

  const whereClause = filters.appelOffre ? `and value->>'appelOffre' =  $2` : '';

  const paginationClause = format(
    'limit %s offset %s',
    pagination.itemsPerPage,
    pagination.page <= 1 ? 0 : (pagination.page - 1) * pagination.itemsPerPage,
  );

  const query = `${getTâchesQuery} ${whereClause} order by value->>'misÀJourLe' ${paginationClause}`;

  const result = await executeSelect<{
    value: TâcheProjection;
  }>(
    query,
    identifiants.map(
      ({ appelOffre, numéroCRE, période, famille }) =>
        `${appelOffre}#${période}#${famille}#${numéroCRE}`,
    ),
    ...(filters.appelOffre ? [filters.appelOffre] : []),
  );

  const countQuery = `${countTâchesQuery} ${whereClause}`;
  const countResult = await executeSelect<{ totalItems: string }>(
    countQuery,
    identifiants.map(
      ({ appelOffre, numéroCRE, période, famille }) =>
        `${appelOffre}#${période}#${famille}#${numéroCRE}`,
    ),
    ...(filters.appelOffre ? [filters.appelOffre] : []),
  );

  return {
    items: result.map((r) => r.value),
    currentPage: pagination?.page ?? 1,
    itemsPerPage: pagination?.itemsPerPage ?? result.length,
    totalItems: parseInt(countResult[0].totalItems),
  };
};
