import format from 'pg-format';
import {
  RécupérerNombreTâchePort,
  RécupérerTâchesPort,
  TâcheEntity,
} from '@potentiel-domain/tache';
import { executeSelect } from '@potentiel-librairies/pg-helpers';
import { listerIdentifiantsProjetsParPorteurAdapter } from '../projet/listerIdentifiantsProjetsParPorteur.adapter';

const countTâchesQuery = `
  select count(key) as "totalItems"
  from domain_views.projection 
  where key like 'tâche|%' and value->>'identifiantProjet' = any($1)
`;

export const récupérerNombreTâcheAdapter: RécupérerNombreTâchePort = async (email) => {
  const identifiants = await listerIdentifiantsProjetsParPorteurAdapter(email);

  const countResult = await executeSelect<{ totalItems: string }>(
    countTâchesQuery,
    identifiants.map(
      ({ appelOffre, numéroCRE, période, famille }) =>
        `${appelOffre}#${période}#${famille}#${numéroCRE}`,
    ),
  );
  return parseInt(countResult[0].totalItems);
};

const getTâchesQuery = `
  select value
  from domain_views.projection 
  where key like 'tâche|%' and value->>'identifiantProjet' = any($1)
`;

export const récupérerTâchesAdapter: RécupérerTâchesPort = async (email, filters, pagination) => {
  const identifiants = await listerIdentifiantsProjetsParPorteurAdapter(email);

  const whereClause = filters.appelOffre ? `and value->>'appelOffre' =  $2` : '';

  const paginationClause = format(
    'limit %s offset %s',
    pagination.itemsPerPage,
    pagination.page <= 1 ? 0 : (pagination.page - 1) * pagination.itemsPerPage,
  );

  const query = `${getTâchesQuery} ${whereClause} order by value->>'misÀJourLe' ${paginationClause}`;

  const result = await executeSelect<{
    value: TâcheEntity;
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
