import format from 'pg-format';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Option } from '@potentiel-libraries/monads';

export const consulterRecoursAdapter = async (
  identifiantProjet: IdentifiantProjet.ValueType,
): Promise<Option.Type<string>> => {
  const selectRecoursQuery = format(`
    SELECT "projectId",f."filename"
    FROM "projects" p
    INNER JOIN "modificationRequests" mr on mr."projectId"=p.id and mr."type"='recours' and mr."status"='acceptée'
    INNER JOIN files f  on f.id =mr."responseFileId" and f."forProject" =p.id
    WHERE p."appelOffreId" = $1 and p."periodeId" = $2 and p."familleId" = $3 and p."numeroCRE" = $4
    ORDER BY "requestedOn" desc;
  `);

  const results = await executeSelect<{ projectId: string; filename: string }>(
    selectRecoursQuery,
    identifiantProjet.appelOffre,
    identifiantProjet.période,
    identifiantProjet.famille,
    identifiantProjet.numéroCRE,
  );

  const recours = results[0];
  if (!recours) {
    return Option.none;
  }
  return `projects/${recours.projectId}/${recours.filename}`;
};
