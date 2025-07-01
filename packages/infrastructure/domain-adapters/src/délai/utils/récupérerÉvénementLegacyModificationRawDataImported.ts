import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { RécupérerDélaiÉvénement } from '../consulterDélaiAccordéProjet.adapter';

export const récupérerÉvénementLegacyModificationRawDataImported: RécupérerDélaiÉvénement = async ({
  identifiantProjet,
}) => {
  const query = `
      select
        json_array_elements(payload->'modifications') as "modifications"
      from "eventStores" es
      where 
        es.type = 'LegacyModificationRawDataImported'
        and es.payload->>'modifications'::text like '%délai%'
        and es.payload->>'appelOffreId' = $1 
        and es.payload->>'periodeId' = $2 
        and es.payload->>'familleId' = $3 
        and es.payload->>'numeroCRE' = $4;
      `;

  const items = await executeSelect<{
    modifications: {
      type: string;
      modifiedOn: number;
      nouvelleDateLimiteAchevement: number;
      ancienneDateLimiteAchevement: number;
      status: string;
    };
  }>(
    query,
    identifiantProjet.appelOffre,
    identifiantProjet.période,
    identifiantProjet.famille,
    identifiantProjet.numéroCRE,
  );

  return items
    .map((item) => item.modifications)
    .filter((item) => item.type === 'delai' && item.status === 'acceptée')
    .map(({ modifiedOn, ancienneDateLimiteAchevement, nouvelleDateLimiteAchevement }) => {
      const dateCréation = DateTime.convertirEnValueType(new Date(modifiedOn)).formatter();
      const ancienneDate = new Date(ancienneDateLimiteAchevement);
      const nouvelleDate = new Date(nouvelleDateLimiteAchevement);

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
          accordéLe: DateTime.convertirEnValueType(dateCréation).formatter(),
        },
      };

      return result;
    });
};
