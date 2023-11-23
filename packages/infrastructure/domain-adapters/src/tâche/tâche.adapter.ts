import { RécupérerNombreTâchePort } from '@potentiel-domain/tache';
import { executeSelect } from '@potentiel/pg-helpers';

const countNombreTâcheQuery = `
  select json_build_object(
    'nombreTâche', 
    sum(CAST(value->'nombreTâches' as numeric))
  ) as value 
  from domain_views.projection 
  where 
    key = any($1) and 
    CAST(value->'nombreTâches' as numeric) > 0;
`;

export const récupérerNombreTâcheAdapter: RécupérerNombreTâchePort = async (email) => {
  const result = await executeSelect<{
    value: {
      nombreTâches: number;
    };
  }>(countNombreTâcheQuery);

  if (!result.length) {
    return 0;
  }

  return result[0].value.nombreTâches;
};
