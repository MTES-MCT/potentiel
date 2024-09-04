import { ListerUtilisateurPort, UtilisateurEntity } from '@potentiel-domain/utilisateur';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

const selectUtilisateursQuery = `
  select json_build_object(
    'email', "email",
    'nomComplet', "fullName",
    'fonction', "fonction",
    'identifiantUtilisateur', "email",
    'régionDreal', ud."dreal"
  ) as value
  from "users" u
  left join "userDreals" ud on ud."userId" = u."id" 
  where role in ($1)
`;

export const listerUtilisateursAdapter: ListerUtilisateurPort = async (roles) => {
  const utilisateurs = await executeSelect<{
    value: UtilisateurEntity;
  }>(selectUtilisateursQuery, roles);

  return utilisateurs.map(({ value }) => value);
};
