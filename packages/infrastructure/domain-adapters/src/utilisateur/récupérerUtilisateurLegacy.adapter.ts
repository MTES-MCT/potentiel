import { RécupérerUtilisateurPort, UtilisateurEntity } from '@potentiel-domain/utilisateur';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Option } from '@potentiel-libraries/monads';

const selectUtilisateurQuery = `
  select json_build_object(
    'email', "email",
    'nomComplet', "fullName",
    'fonction', "fonction",
    'identifiantUtilisateur', "email",
    'régionDreal', ud."dreal",
    'rôle', "role"
  ) as value
  from "users" u
  left join "userDreals" ud on ud."userId" = u."id" 
  where "email" = $1
`;

export const récupérerUtilisateurAdapter: RécupérerUtilisateurPort = async (
  identifiantUtilisateur,
) => {
  const utilisateurs = await executeSelect<{
    value: UtilisateurEntity;
  }>(selectUtilisateurQuery, identifiantUtilisateur);

  if (!utilisateurs.length) {
    return Option.none;
  }

  return utilisateurs[0].value;
};
