import { RécupérerNombreTâchePort } from '@potentiel-domain/tache';
import { executeSelect } from '@potentiel/pg-helpers';

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

const getProjetByEmailUtilisateurQuery = `
  select json_build_object(
    'appelOffre', p."appelOffreId",
    'période', p."periodeId",
    'famille', p."familleId",
    'numéroCRE', p."numeroCRE"
  ) as value
  from "projects" p
  inner join "UserProjects" up on p.id = up."projectId"
  inner join "users" u on up."userId" = u.id
  where p."notifiedOn" > 0 and u."email" = $1
`;

export const récupérerNombreTâcheAdapter: RécupérerNombreTâchePort = async (email) => {
  const projects = await executeSelect<{
    value: {
      appelOffre: string;
      période: string;
      famille?: string;
      numéroCRE: string;
    };
  }>(getProjetByEmailUtilisateurQuery, email);

  const identifiants = projects.map(
    ({ value: { appelOffre, numéroCRE, période, famille } }) =>
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
