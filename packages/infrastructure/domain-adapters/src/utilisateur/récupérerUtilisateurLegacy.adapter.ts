import { RécupérerUtilisateurPort, UtilisateurProjection } from '@potentiel-domain/utilisateur';
import { none } from '@potentiel/monads';
import { executeSelect } from '@potentiel/pg-helpers';

const selectUtilisateurQuery = `
  select json_build_object(
    'email', "email",
    'nomComplet', "fullName",
    'fonction', "fonction",
    'identifiantUtilisateur', "email"
  ) as value
  from "users"
  where "email" = $1
`;

export const récupérerUtilisateurAdapter: RécupérerUtilisateurPort = async (
  identifiantUtilisateur,
) => {
  const utilisateurs = await executeSelect<{
    value: UtilisateurProjection;
  }>(selectUtilisateurQuery, identifiantUtilisateur);

  if (!utilisateurs.length) {
    return none;
  }

  return utilisateurs[0].value;
};
