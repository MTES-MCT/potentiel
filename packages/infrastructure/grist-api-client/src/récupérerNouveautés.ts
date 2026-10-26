import { DateTime } from '@potentiel-domain/common';
import type { Nouveautés } from '@potentiel-domain/nouveautes';
import { get } from '@potentiel-libraries/http-client';
import { getLogger } from '@potentiel-libraries/monitoring';

import { getGristConfig, gristRecordsSchema, nouveautéFieldsSchema } from './constant.js';

export const récupérerNouveautés: Nouveautés.RécupérerNouveautésPort = async () => {
  const { apiUrl, apiKey, docId, tableId } = getGristConfig();

  const url = new URL(`api/docs/${docId}/tables/${tableId}/records`, apiUrl);
  url.searchParams.set('sort', '-Date');

  const result = await get({
    url,
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  const { records } = gristRecordsSchema.parse(result);

  if (!records.length) {
    return [];
  }

  return records.flatMap(({ id, fields }) => {
    if (estLigneVide(fields)) {
      return [];
    }

    const parsedFields = nouveautéFieldsSchema.safeParse(fields);

    if (!parsedFields.success) {
      getLogger('récupérerNouveautés').warn('Nouveauté Grist invalide', {
        id,
        error: parsedFields.error.message,
      });
      return [];
    }

    const { Titre, Description, Date: timestamp, Roles, Lien } = parsedFields.data;

    return [
      {
        titre: Titre,
        description: Description,
        date: timestamp
          ? DateTime.convertirEnValueType(new Date(timestamp * 1000)).formatter()
          : undefined,
        rôles: Roles,
        lien: Lien,
      },
    ];
  });
};

const estValeurVide = (valeur: unknown) =>
  !valeur ||
  // Grist encode les ChoiceList sous la forme ['L', ...choix] : ['L'] seul correspond à une liste vide
  (Array.isArray(valeur) && valeur.every((élément) => élément === 'L'));

const estLigneVide = (fields: Record<string, unknown>) =>
  Object.values(fields).every(estValeurVide);
