import { IdentifiantProjet } from '@potentiel-domain/common';
import { Raccordement } from '@potentiel-domain/reseau';
import { Groupe, Role, VérifierAccèsProjetPort } from '@potentiel-domain/utilisateur';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

const getEstUnProjetAccessiblePorteurQuery = `
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

const getEstUnProjetAccessibleDrealQuery = `
  select json_build_object(
    'exists', 1
  ) as value
  from "projects" p
  inner join "userDreals" ud on p."regionProjet" = ud.dreal
  inner join "users" u on ud."userId" = u.id
  where p."appelOffreId" = $1 
  and   p."periodeId" = $2 
  and   p."numeroCRE" = $3 
  and   p."familleId" = $4
  and   u."email" = $5`;

export const vérifierAccèsProjetAdapter: VérifierAccèsProjetPort = async ({
  identifiantProjetValue,
  utilisateur,
}) => {
  const { appelOffre, période, famille, numéroCRE } =
    IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

  if (utilisateur.role.estÉgaleÀ(Role.grd)) {
    if (Option.isNone(utilisateur.groupe)) {
      return false;
    }
    const raccordement = await findProjection<Raccordement.RaccordementEntity>(
      `raccordement|${identifiantProjetValue}`,
    );
    if (Option.isNone(raccordement)) {
      return false;
    }
    const expectedGroupe = Groupe.convertirEnValueType(
      `/GestionnairesRéseau/${raccordement.identifiantGestionnaireRéseau}`,
    );

    return utilisateur.groupe.estÉgaleÀ(expectedGroupe);
  }

  const results = await executeSelect<{ exists: 1 }>(
    utilisateur.role.estÉgaleÀ(Role.dreal)
      ? getEstUnProjetAccessibleDrealQuery
      : getEstUnProjetAccessiblePorteurQuery,
    appelOffre,
    période,
    numéroCRE,
    famille,
    utilisateur.identifiantUtilisateur.formatter(),
  );

  return results.length > 0;
};
