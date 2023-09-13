import { RécupérerLesPorteursÀNotifierPort } from '@potentiel/domain';
import { isSome, none } from '@potentiel/monads';
import { executeSelect } from '@potentiel/pg-helpers';

const selectEmailEtNomPorteursÀNotifierPourUnProjetQuery = `
  select json_build_object(
    'name', u."fullName",
    'email', u."email"
  ) as value
  from "users" u
  where u."id" in (
    select up."userId"
    from "UserProjects" up
    where up."projectId" = (
      select "id"
      from "projects"
      where "appelOffreId" = $1 and "periodeId" = $2 and "numeroCRE" = $3 and "familleId" = $4
    )
  )
`;

export const récupérerLesPorteursÀNotifierAdapter: RécupérerLesPorteursÀNotifierPort = async ({
  identifiantProjet,
}) => {
  const { appelOffre, période, famille, numéroCRE } = identifiantProjet;

  const porteurs = await executeSelect<{
    value: {
      name: string;
      email: string;
    };
  }>(
    selectEmailEtNomPorteursÀNotifierPourUnProjetQuery,
    appelOffre,
    période,
    numéroCRE,
    isSome(famille) ? famille : '',
  );

  return !porteurs.length
    ? none
    : porteurs.map(({ value: { name, email } }) => ({
        name,
        email,
      }));
};
