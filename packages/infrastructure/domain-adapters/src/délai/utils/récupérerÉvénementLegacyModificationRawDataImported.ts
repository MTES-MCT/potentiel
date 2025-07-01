import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { DateTime } from '@potentiel-domain/common';

import { RécupérerDélaiÉvénement } from '../consulterDélaiAccordéProjet.adapter';

export const récupérerÉvénementLegacyModificationRawDataImported: RécupérerDélaiÉvénement = async ({
  identifiantProjet,
}) => {
  const query = `
      select (SELECT to_char (es."createdAt" at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) as "dateCréation", 
      es.payload,
      from "eventStores" es
      where es.type = 'LegacyModificationRawDataImported'
      and es.payload->>'modifications'::text like '%délai%'
      and es.payload->>'appelOffreId' = $1 
      and es.payload->>'periodeId' = $2 
      and es.payload->>'familleId' = $3 
      and es.payload->>'numeroCRE' = $4;
      `;

  const items = await executeSelect<{
    modifications: ReadonlyArray<{
      type: string;
      modifiedOn: number;
      nouvelleDateLimiteAchevement: number;
      ancienneDateLimiteAchevement: number;
      status: string;
    }>;
  }>(
    query,
    identifiantProjet.appelOffre,
    identifiantProjet.période,
    identifiantProjet.famille,
    identifiantProjet.numéroCRE,
  );

  const result = items.map(({ modifications }) =>
    modifications
      .filter(({ type, status }) => type === 'delai' && status === 'acceptée')

      .map(({ modifiedOn, ancienneDateLimiteAchevement, nouvelleDateLimiteAchevement }) => {
        const dateCréation = DateTime.convertirEnValueType(new Date(modifiedOn)).formatter();
        const durée = 

        return {
          id: `${identifiantProjet}#${dateCréation}`,
          category: 'délai',
          createdAt: dateCréation,
          type: 'DélaiAccordé-V1',
          payload: {
            identifiantProjet: identifiantProjet.formatter(),
            durée,
            raison: 'demande',
            accordéLe: DateTime.convertirEnValueType(dateCréation).formatter(),
          },
        };
      }),
  );
};

/*

*/
