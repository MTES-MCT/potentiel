import { RécupérerUtilisateurPort, UtilisateurEntity } from '@potentiel-domain/utilisateur';
import { executeSelect } from '@potentiel-librairies/pg-helpers';
import { Option } from '@potentiel-librairies/monads';

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
    value: UtilisateurEntity;
  }>(selectUtilisateurQuery, identifiantUtilisateur);

  if (!utilisateurs.length) {
    return Option.none;
  }

  return utilisateurs[0].value;
};
