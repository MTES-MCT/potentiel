import zod from 'zod';

import { Nouveautés } from '@potentiel-domain/nouveautes';
import { Role } from '@potentiel-domain/utilisateur';

class GristClientConfigurationError extends Error {
  constructor(public variablesManquantes: Array<string>) {
    super(`Configuration is missing for the GristClient: ${variablesManquantes.join(', ')}`);
  }
}

export const getGristConfig = () => {
  const { GRIST_API_URL, GRIST_API_KEY, GRIST_DOC_ID, GRIST_TABLE_ID } = process.env;

  if (!GRIST_API_URL || !GRIST_API_KEY || !GRIST_DOC_ID || !GRIST_TABLE_ID) {
    const variablesManquantes = Object.entries({
      GRIST_API_URL,
      GRIST_API_KEY,
      GRIST_DOC_ID,
      GRIST_TABLE_ID,
    })
      .filter(([, valeur]) => !valeur)
      .map(([nom]) => nom);

    throw new GristClientConfigurationError(variablesManquantes);
  }

  return {
    apiUrl: GRIST_API_URL,
    apiKey: GRIST_API_KEY,
    docId: GRIST_DOC_ID,
    tableId: GRIST_TABLE_ID,
  };
};

const optionnalTextSchema = zod
  .string()
  .nullish()
  .transform((valeur) => valeur || undefined);

export const gristRecordsSchema = zod.object({
  records: zod.array(
    zod.object({
      id: zod.number(),
      fields: zod.record(zod.string(), zod.unknown()),
    }),
  ),
});

export const nouveautéFieldsSchema = zod
  .object({
    Titre: zod.string().min(1),
    Description: optionnalTextSchema,
    Date: zod.number().nullish(),
    Roles: zod
      .tuple([zod.literal('L')], zod.enum(Role.roles))
      .nullish()
      .transform((valeur) => {
        if (!valeur) {
          return [];
        }
        const [, ...rôles] = valeur;
        return rôles;
      }),
    Lien: optionnalTextSchema,
    Type_de_lien: zod
      .enum(Nouveautés.typesDeLien)
      .or(zod.literal(''))
      .nullish()
      .transform((valeur) => valeur || 'interne'),
    Route: optionnalTextSchema,
  })
  .transform(({ Type_de_lien, Lien, Route, ...fields }, ctx) => {
    const lien = mapToLienNouveauté({ type: Type_de_lien, url: Lien, route: Route });

    if (lien === null) {
      ctx.issues.push({
        code: 'custom',
        input: { Type_de_lien, Lien, Route },
        message:
          'Lien interne : Route obligatoire et Lien vide. Lien externe : Lien obligatoire et Route vide.',
      });
      return zod.NEVER;
    }

    return { ...fields, lien };
  });

type MapToLienNouveautéProps = {
  type?: Nouveautés.TypeDeLien;
  url?: string;
  route?: string;
};

const mapToLienNouveauté = ({
  type,
  url,
  route,
}: MapToLienNouveautéProps): Nouveautés.LienNouveauté | undefined | null => {
  if (type === 'interne' && route && !url) {
    return { type: 'interne', route };
  }
  if (type === 'externe' && url && !route) {
    return { type: 'externe', url };
  }
  if (!type && !url && !route) {
    return undefined;
  }

  /**
   * null ici signifie "incohérent", là où "undefined" veut dire "pas de lien"
   */
  return null;
};
