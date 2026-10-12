import zod from 'zod';

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

export const typesDeLien = ['interne', 'externe'] as const;

const texteOptionnelSchema = zod
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

export const nouveautéFieldsSchema = zod.object({
  Titre: zod.string().min(1),
  Description: texteOptionnelSchema,
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
  Lien: texteOptionnelSchema,
  Type_de_lien: zod
    .enum(typesDeLien)
    .or(zod.literal(''))
    .nullish()
    .transform((valeur) => valeur || 'interne'),
});
