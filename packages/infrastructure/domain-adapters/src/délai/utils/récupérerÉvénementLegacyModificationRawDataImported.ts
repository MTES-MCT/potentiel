import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { RécupérerDélaiÉvénement } from '../consulterDélaiAccordéProjet.adapter';

export const récupérerÉvénementLegacyModificationRawDataImported: RécupérerDélaiÉvénement = async ({
  identifiantProjet,
}) => {
  const query = `
        select 
            distinct 
            (json_array_elements(payload->'modifications'))->>'type' as "type",
            (json_array_elements(payload->'modifications'))->>'status' as "status",
            (json_array_elements(payload->'modifications'))->>'modifiedOn' as "modifiedOn",
            (json_array_elements(payload->'modifications'))->>'ancienneDateLimiteAchevement' as "ancienneDateLimiteAchevement",
            (json_array_elements(payload->'modifications'))->>'nouvelleDateLimiteAchevement' as "nouvelleDateLimiteAchevement"
        from "eventStores" es
        where es.type = 'LegacyModificationRawDataImported'
        and es.payload->>'modifications'::text like '%délai%'
        and es.payload->>'appelOffreId' = $1 
        and es.payload->>'periodeId' = $2 
        and es.payload->>'familleId' = $3 
        and es.payload->>'numeroCRE' = $4;
      `;

  const items = await executeSelect<{
    type: string;
    status: string;
    modifiedOn: string;
    ancienneDateLimiteAchevement: string;
    nouvelleDateLimiteAchevement: string;
  }>(
    query,
    identifiantProjet.appelOffre,
    identifiantProjet.période,
    identifiantProjet.famille,
    identifiantProjet.numéroCRE,
  );

  console.log(`ITEMS = `, items);

  return items
    .filter((item) => item.type === 'delai' && item.status === 'acceptée')
    .map(({ modifiedOn, ancienneDateLimiteAchevement, nouvelleDateLimiteAchevement }) => {
      const dateCréation = DateTime.convertirEnValueType(
        new Date(Number.parseInt(modifiedOn)),
      ).formatter();

      const ancienneDate = new Date(Number.parseInt(ancienneDateLimiteAchevement));
      const nouvelleDate = new Date(Number.parseInt(nouvelleDateLimiteAchevement));

      const durée =
        (nouvelleDate.getFullYear() - ancienneDate.getFullYear()) * 12 +
        (nouvelleDate.getMonth() - ancienneDate.getMonth());

      console.log('ANCIENNE', ancienneDate);
      console.log('NOUVELLE', nouvelleDate);

      const result: Lauréat.Délai.HistoriqueDélaiProjetListItemReadModel = {
        id: `${identifiantProjet}#${dateCréation}`,
        category: 'délai',
        createdAt: dateCréation,
        type: 'DélaiAccordé-V1',
        payload: {
          identifiantProjet: identifiantProjet.formatter(),
          durée,
          raison: 'demande',
          accordéLe: dateCréation,
        },
      };

      return result;
    });
};
