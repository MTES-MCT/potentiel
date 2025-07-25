import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { DateTime } from '@potentiel-domain/common';

import { RécupérerDélaiÉvénement } from '../listerDélaiAccordéProjet.adapter';

export const récupérerÉvénementDélaiAccordé: RécupérerDélaiÉvénement = async ({
  identifiantProjet,
}) => {
  const query = `
          select  
            (to_char (es."createdAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) as "dateCréation",
            round(((payload->>'dateAchèvementAccordée')::date - (payload->>'ancienneDateThéoriqueAchèvement')::date)::float / 30) as "nombreDeMois"
          from "eventStores" es
          join "projects" p on p."id"::text = es.payload->>'projetId'
          where 
            es.type = 'DélaiAccordé'
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
