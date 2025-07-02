import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { RécupérerDélaiÉvénement } from '../listerDélaiAccordéProjet.adapter';

export const récupérerÉvénementLegacyModificationRawDataImported: RécupérerDélaiÉvénement = async ({
  identifiantProjet,
}) => {
  const query = `
        select 
            distinct
            modifications->>'type' as "type",
            modifications->>'status' as "status",
            modifications->>'modifiedOn' as "modifiedOn",
            modifications->>'ancienneDateLimiteAchevement' as "ancienneDateLimiteAchevement",
            modifications->>'nouvelleDateLimiteAchevement' as "nouvelleDateLimiteAchevement"
        from "eventStores" es
        cross join lateral json_array_elements(es.payload->'modifications') modifications
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
