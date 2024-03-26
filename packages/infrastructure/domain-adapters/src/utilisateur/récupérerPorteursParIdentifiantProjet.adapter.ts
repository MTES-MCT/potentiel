import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel/monads';
import { executeSelect } from '@potentiel-librairies/pg-helpers';

const selectPorteursProjectQuery = `
  select json_build_object(
    'email', "email", 
    'fullName', "fullName") 
  as value from (
    select distinct u.email, u."fullName" 
    from "users" u 
    inner join "UserProjects" up on u.id = up."userId" 
    inner join "projects" p on up."projectId" = p.id
    where p."appelOffreId" = $1 and p."periodeId" = $2 and p."numeroCRE" = $3 and p."familleId" = $4
  ) as u
`;

export const récupérerPorteursParIdentifiantProjetAdapter = async ({
  appelOffre,
  période,
  famille,
  numéroCRE,
}: IdentifiantProjet.ValueType) => {
  const porteurs = await executeSelect<{
    value: { email: string; fullName: string };
  }>(
    selectPorteursProjectQuery,
    appelOffre,
    période,
    numéroCRE,
    Option.isSome(famille) ? famille : '',
  );

  return porteurs.map((p) => ({ ...p.value }));
};
