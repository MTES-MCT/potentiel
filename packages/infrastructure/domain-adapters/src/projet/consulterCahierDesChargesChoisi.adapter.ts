import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';

const selectProjectQuery = `
  select json_build_object(
    'cahierDesCharges', "cahierDesChargesActuel"
  ) as value
  from "projects"
  where "appelOffreId" = $1 and "periodeId" = $2 and "numeroCRE" = $3 and "familleId" = $4
`;

export const consulterCahierDesChargesChoisiAdapter: Lauréat.ConsulterCahierDesChargesChoisiPort =
  async ({ appelOffre, période, famille, numéroCRE }) => {
    const projets = await executeSelect<{
      value: {
        cahierDesCharges: string;
      };
    }>(selectProjectQuery, appelOffre, période, numéroCRE, famille);

    if (!projets.length) {
      return Option.none;
    }

    const projet = projets[0].value;

    return projet.cahierDesCharges;
  };
