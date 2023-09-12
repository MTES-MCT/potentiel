import { RécupérerLesPorteursÀNotifierPort } from '@potentiel/domain';
import { ProjetReadModel } from '@potentiel/domain-views';
import { isSome, none } from '@potentiel/monads';
import { executeSelect } from '@potentiel/pg-helpers';

const selectProjectQuery = `
  select json_build_object(
    'legacyId', "id"
  ) as value
  from "projects"
  where "appelOffreId" = $1 and "periodeId" = $2 and "numeroCRE" = $3 and "familleId" = $4
`;

const selectUserIdsQuery = `
  select json_build_object(
    'userId', "userId"
  ) as value
  from "UserProjects"
  where "projectId" = $1
`;

const selectUserEmailAndNameQuery = `
  select json_build_object(
    'name', "fullName",
    'email', "email"
  ) as value
  from "users"
  where "id" = $1
`;

export const récupérerLesPorteursÀNotifierAdapter: RécupérerLesPorteursÀNotifierPort = async ({
  identifiantProjet,
}) => {
  const { appelOffre, période, famille, numéroCRE } = identifiantProjet;

  const projet = await executeSelect<{
    value: Pick<ProjetReadModel, 'legacyId' | 'nom'>;
  }>(selectProjectQuery, appelOffre, période, numéroCRE, isSome(famille) ? famille : '');

  if (!projet.length) {
    return none;
  }

  const { legacyId } = projet[0].value;

  const userIds = await executeSelect<{
    value: {
      userId: string;
    };
  }>(selectUserIdsQuery, legacyId);

  if (!userIds.length) {
    return none;
  }

  const porteurs: { name: string; email: string }[] = [];

  for (const {
    value: { userId },
  } of userIds) {
    const userEmailAndName = await executeSelect<{
      value: {
        name: string;
        email: string;
      };
    }>(selectUserEmailAndNameQuery, userId);
    if (!userEmailAndName.length) {
      // TODO : Quid du porteur non trouvé ? On arrete l'éxécution ou on continue ?
      continue;
    }
    porteurs.push(userEmailAndName[0].value);
  }

  return porteurs;
};
