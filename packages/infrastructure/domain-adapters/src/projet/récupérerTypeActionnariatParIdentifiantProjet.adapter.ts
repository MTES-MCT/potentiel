import { IdentifiantProjet } from '@potentiel-domain/common';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Option } from '@potentiel-libraries/monads';

// MERCI DE NE PAS TOUCHER CETTE QUERY
const selectTypeActionnariatByProjetQuery = `
  select json_build_object(
    'isFinancementParticipatif', "isFinancementParticipatif",
    'isInvestissementParticipatif', "isInvestissementParticipatif"
  ) as value
  from "projects"
  where "appelOffreId" = $1 and "periodeId" = $2 and "numeroCRE" = $3 and "familleId" = $4
`;

export const récupérerTypeActionnariatParIdentifiantProjetAdapter = async ({
  appelOffre,
  période,
  famille,
  numéroCRE,
}: IdentifiantProjet.ValueType) => {
  const result = await executeSelect<{
    value: { isFinancementParticipatif: boolean; isInvestissementParticipatif: boolean };
  }>(selectTypeActionnariatByProjetQuery, appelOffre, période, numéroCRE, famille);

  if (!result.length) {
    return Option.none;
  }

  return result[0].value;
};
