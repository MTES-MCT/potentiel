import { CommonPort } from '@potentiel-domain/common';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Option } from '@potentiel-libraries/monads';

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

export const récupérerRégionDrealAdapter: CommonPort.RécupérerRégionDrealPort = async (
  identifiantUtilisateur,
) => {
  const résultat = await executeSelect<{
    value: { région: string };
  }>(query, identifiantUtilisateur);

  if (!résultat.length) {
    return Option.none;
  }

  return résultat[0].value;
};
