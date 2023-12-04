import { Ports } from '@potentiel-domain/common';
import { executeSelect } from '@potentiel/pg-helpers';

const getDrealRégionQuery = `
select json_build_object('région', ud.dreal) as value
from users u 
inner join "userDreals" ud on u.id = ud."userId"
where u.email = $1;
`;

const getIdentifiantsProjetByRégionQuery = `
  select json_build_object(
    'appelOffre', p."appelOffreId",
    'période', p."periodeId",
    'famille', p."familleId",
    'numéroCRE', p."numeroCRE"
  ) as value
  from "projects" p
  where p."regionProjet" like '%' || $1 || '%';
`;

export const listerIdentifiantsProjetsParDrealAdapter: Ports.ListerIdentifiantsProjetsParPorteurPort =
  async (email) => {
    const dreal = await executeSelect<{ value: { région: string } }>(getDrealRégionQuery, email);
    const results = await executeSelect<{
      value: {
        appelOffre: string;
        période: string;
        famille?: string;
        numéroCRE: string;
      };
    }>(getIdentifiantsProjetByRégionQuery, dreal[0].value.région);

    return results.map((result) => result.value);
  };
