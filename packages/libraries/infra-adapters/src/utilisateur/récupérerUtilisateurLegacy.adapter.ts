import {
  UtilisateurLegacyReadModel,
  RécupérerUtilisateurLegacyPort,
} from '@potentiel/domain-views';
import { none } from '@potentiel/monads';
import { executeSelect } from '@potentiel/pg-helpers';

const selectUtilisateurQuery = `
  select json_build_object(
    'email', "email",
    'nomComplet', "fullName",
    'fonction', "fonction",
    'identifiantUtilisateur', "email",
    'role', "role"
  ) as value
  from "users"
  where "email" = $1
`;

export const récupérerUtilisateurAdapter: RécupérerUtilisateurLegacyPort = async (
  identifiantUtilisateur,
) => {
  const utilisateurs = await executeSelect<{
    value: Omit<UtilisateurLegacyReadModel, 'type'>;
  }>(selectUtilisateurQuery, identifiantUtilisateur);

  if (!utilisateurs.length) {
    return none;
  }

  const utilisateur = utilisateurs[0].value;

  return {
    ...utilisateur,
    accountUrl: `${process.env.KEYCLOAK_SERVER ?? ''}/realms/${
      process.env.KEYCLOAK_REALM ?? ''
    }/account`,
    type: 'utilisateur',
  };
};
