import { RécupérerRégionDrealPort } from '@potentiel-domain/common';
import { none } from '@potentiel/monads';
import { executeSelect } from '@potentiel/pg-helpers';

const query = `
  select json_build_object(
    'région', ud."dreal"
  ) as value
  from "userDreals" ud
  where "userId" = (
                    select id
                    from users
                    where email = $1
                    and role = 'dreal'
                   )
  ;                 
`;

export const récupérerRégionDreal: RécupérerRégionDrealPort = async (identifiantUtilisateur) => {
  const résultat = await executeSelect<{
    value: { région: string };
  }>(query, identifiantUtilisateur);

  if (!résultat.length) {
    return none;
  }

  return résultat[0].value;
};
