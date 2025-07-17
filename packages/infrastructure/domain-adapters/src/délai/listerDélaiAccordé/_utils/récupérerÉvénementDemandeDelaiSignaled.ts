import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { DateTime } from '@potentiel-domain/common';

import { RécupérerDélaiÉvénement } from '../listerDélaiAccordéProjet.adapter';

export const récupérerÉvénementDemandeDelaiSignaled: RécupérerDélaiÉvénement = async ({
  identifiantProjet,
}) => {
  const query = `
        select 
          to_char(
            to_timestamp((es.payload->>'decidedOn')::bigint / 1000) AT TIME ZONE 'UTC',
            'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
          ) AS "dateCréation",
          round(
            (
              to_timestamp((payload->>'newCompletionDueOn')::bigint / 1000)::date - 
              to_timestamp((payload->>'oldCompletionDueOn')::bigint / 1000)::date
            )::float / 30) as "nombreDeMois"
        from "eventStores" es
        join "projects" p on p."id"::text = es.payload->>'projectId'
        where 
          es.type = 'DemandeDelaiSignaled'
          and es.payload->>'status' = 'acceptée'
		      and es.payload->>'newCompletionDueOn' is not null
		      and es.payload->>'oldCompletionDueOn' is not null
          and p."appelOffreId" = $1 
          and p."periodeId" = $2 
          and p."familleId" = $3 
          and p."numeroCRE" = $4;
      `;

  const items = await executeSelect<{ dateCréation: string; nombreDeMois: number }>(
    query,
    identifiantProjet.appelOffre,
    identifiantProjet.période,
    identifiantProjet.famille,
    identifiantProjet.numéroCRE,
  );

  return items.map(({ dateCréation, nombreDeMois }) => ({
    id: `${identifiantProjet}#${dateCréation}`,
    category: 'délai',
    createdAt: dateCréation,
    type: 'LegacyDélaiAccordé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      nombreDeMois,
      raison: 'demande',
      accordéLe: DateTime.convertirEnValueType(dateCréation).formatter(),
    },
  }));
};
