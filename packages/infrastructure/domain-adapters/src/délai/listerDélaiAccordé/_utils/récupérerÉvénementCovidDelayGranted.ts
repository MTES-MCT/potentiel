import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { DateTime } from '@potentiel-domain/common';

import { RécupérerDélaiÉvénement } from '../listerDélaiAccordéProjet.adapter';

export const récupérerÉvénementCovidDelayGranted: RécupérerDélaiÉvénement = async ({
  identifiantProjet,
}) => {
  const query = `
      select 
        (SELECT to_char (es."createdAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) as "dateCréation", 
        
        7 as "durée"
      from "eventStores" es 
      join projects p on p.id::text = es.payload->>'projectId' 
      where 
        es.type = 'CovidDelayGranted'
        and p."appelOffreId" = $1 
        and p."periodeId" = $2 
        and p."familleId" = $3 
        and p."numeroCRE" = $4;
      `;

  const items = await executeSelect<{ dateCréation: string; durée: number }>(
    query,
    identifiantProjet.appelOffre,
    identifiantProjet.période,
    identifiantProjet.famille,
    identifiantProjet.numéroCRE,
  );

  return items.map(({ dateCréation, durée }) => ({
    id: `${identifiantProjet}#${dateCréation}`,
    category: 'délai',
    createdAt: dateCréation,
    type: 'LegacyDélaiAccordé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      durée,
      raison: 'covid',
      accordéLe: DateTime.convertirEnValueType(dateCréation).formatter(),
    },
  }));
};
