import { IdentifiantProjet } from '@potentiel-domain/common';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Option } from '@potentiel-libraries/monads';

const selectPorteursProjectQuery = `
  select json_build_object(
    'email', "email"
  ) 
  as value from (
    select distinct u.email
    from "users" u 
    inner join "UserProjects" up on u.id = up."userId" 
    inner join "projects" p on up."projectId" = p.id
    where p."appelOffreId" = $1 and p."periodeId" = $2 and p."numeroCRE" = $3 and p."familleId" = $4
    and u."disabled" is not true
  ) as u
`;

export const récupérerPorteursParIdentifiantProjetAdapter = async ({
  appelOffre,
  période,
  famille,
  numéroCRE,
}: IdentifiantProjet.ValueType) => {
  const porteurs = await executeSelect<{
    value: { email: string };
  }>(
    selectPorteursProjectQuery,
    appelOffre,
    période,
    numéroCRE,
    Option.isSome(famille) ? famille : '',
  );

  return porteurs.map((p) => ({ ...p.value }));
};
