import { DateTime } from '@potentiel-domain/common';
import { get } from '@potentiel-libraries/http-client';
import { getLogger } from '@potentiel-libraries/monitoring';

import { getGristConfig, gristRecordsSchema, nouveautéFieldsSchema } from './constant.js';
import type { Nouveauté } from './type.js';

export const récupérerNouveautés = async (): Promise<Array<Nouveauté>> => {
  const { apiUrl, apiKey, docId, tableId } = getGristConfig();

  const url = new URL(`api/docs/${docId}/tables/${tableId}/records`, apiUrl);
  url.searchParams.set('sort', '-Date');

  const result = await get({
    url,
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  const { records } = gristRecordsSchema.parse(result);

  return records.flatMap(({ id, fields }) => {
    const parsedFields = nouveautéFieldsSchema.safeParse(fields);

    if (!parsedFields.success) {
      getLogger('récupérerNouveautés').warn('Nouveauté Grist invalide', {
        id,
        error: parsedFields.error.message,
      });
      return [];
    }

    const { Titre, Description, Date: timestamp, Roles, Lien, Type_de_lien } = parsedFields.data;

    return [
      {
        titre: Titre,
        description: Description,
        date: timestamp
          ? DateTime.convertirEnValueType(new Date(timestamp * 1000)).formatter()
          : undefined,
        rôles: Roles,
        lien: Lien ? { url: Lien, type: Type_de_lien } : undefined,
      },
    ];
  });
};
