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
    'identifiantUtilisateur', "hash"
  ) as value
  from "users"
  where "hash" = $1
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
    type: 'utilisateur',
  };
};
