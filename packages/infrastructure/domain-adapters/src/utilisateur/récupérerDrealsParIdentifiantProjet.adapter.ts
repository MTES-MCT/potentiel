import { IdentifiantProjet } from '@potentiel-domain/common';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Option } from '@potentiel-libraries/monads';

const selectDrealsProjectQuery = `
select 
    json_build_object   
    (
      'email', "email"
    ) 
  as value
from 
    (
      select  distinct  u.email
      from "users" u
      inner join "userDreals" ud on u.id = ud."userId"
      inner join "projects" p on p."regionProjet" = ud."dreal"
      where p."appelOffreId" = $1 and p."periodeId" = $2 and p."numeroCRE" = $3 and p."familleId" = $4
      and   u."disabled" is not true
    ) as "user"; 
`;

export const récupérerDrealsParIdentifiantProjetAdapter = async ({
  appelOffre,
  période,
  famille,
  numéroCRE,
}: IdentifiantProjet.ValueType) => {
  const dreals = await executeSelect<{
    value: { email: string };
  }>(
    selectDrealsProjectQuery,
    appelOffre,
    période,
    numéroCRE,
    Option.isSome(famille) ? famille : '',
  );

  return dreals.map((d) => ({ ...d.value }));
};
