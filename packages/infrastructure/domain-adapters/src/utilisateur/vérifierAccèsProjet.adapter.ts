import { IdentifiantProjet } from '@potentiel-domain/common';
import { VérifierAccèsProjetPort } from '@potentiel-domain/utilisateur';
import { executeSelect } from '@potentiel/pg-helpers';

const getEstUnProjetAccessibleQuery = `
  select json_build_object(
    'exists', 1
  ) as value
  from "projects" p
  inner join "UserProjects" up on p.id = up."projectId"
  inner join "users" u on up."userId" = u.id
  where p."appelOffreId" = $1 
  and   p."periodeId" = $2 
  and   p."numeroCRE" = $3 
  and   p."familleId" = $4
  and   u."email" = $5
`;

export const vérifierAccèsProjetAdapter: VérifierAccèsProjetPort = async ({
  identifiantProjetValue,
  identifiantUtilisateurValue,
}) => {
  const { appelOffre, période, famille, numéroCRE } =
    IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

  const results = await executeSelect<{ exists: 1 }>(
    getEstUnProjetAccessibleQuery,
    appelOffre,
    période,
    numéroCRE,
    famille,
    identifiantUtilisateurValue,
  );

  return results.length > 0;
};
