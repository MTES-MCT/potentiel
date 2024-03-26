import { CommonPort } from '@potentiel-domain/common';
import { executeSelect } from '@potentiel-librairies/pg-helpers';

const getIdentifiantProjetByEmailUtilisateurQuery = `
  select json_build_object(
    'appelOffre', p."appelOffreId",
    'période', p."periodeId",
    'famille', p."familleId",
    'numéroCRE', p."numeroCRE"
  ) as value
  from "projects" p
  inner join "UserProjects" up on p.id = up."projectId"
  inner join "users" u on up."userId" = u.id
  where p."notifiedOn" > 0 and u."email" = $1
`;

export const listerIdentifiantsProjetsParPorteurAdapter: CommonPort.ListerIdentifiantsProjetsAccessiblesPort =
  async (email) => {
    const results = await executeSelect<{
      value: {
        appelOffre: string;
        période: string;
        famille?: string;
        numéroCRE: string;
      };
    }>(getIdentifiantProjetByEmailUtilisateurQuery, email);

    return results.map((result) => result.value);
  };
