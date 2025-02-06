import { RécupérerIdentifiantsProjetParEmailPorteurPort } from '@potentiel-domain/utilisateur';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

const getIdentifiantsProjetParEmailUtilisateurQuery = `
  select p."appelOffreId" || '#' || p."periodeId" || '#' || p."familleId"  || '#' || p."numeroCRE" as "identifiantProjet"
  from "projects" p
  inner join "UserProjects" up on p.id = up."projectId"
  inner join "users" u on up."userId" = u.id
  where p."notifiedOn" > 0 and u."email" = $1
`;

export const récupérerIdentifiantsProjetParEmailPorteurAdapter: RécupérerIdentifiantsProjetParEmailPorteurPort =
  async (email) => {
    const results = await executeSelect<{
      identifiantProjet: string;
    }>(getIdentifiantsProjetParEmailUtilisateurQuery, email);

    return results.map((result) => result.identifiantProjet);
  };
