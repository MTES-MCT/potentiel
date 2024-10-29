import { mediator } from 'mediateur';
import * as zod from 'zod';

import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

export const defaultFileSizeLimitInMegaBytes = 5;

const toBytes = (sizeInMegaBytes: number): number => sizeInMegaBytes * 1024 * 1024;

export const documentZodSchema = (options?: { optional?: true }) => {
  return zod
    .instanceof(Blob)
    .refine(({ size }) => (options?.optional ? size >= 0 : size > 0), `Champ obligatoire`)
    .refine(
      ({ size }) => size <= toBytes(defaultFileSizeLimitInMegaBytes),
      `Le fichier dépasse la taille maximale autorisée (${defaultFileSizeLimitInMegaBytes}Mo)`,
    );
};

export const documentKeyZodSchema = zod.string().transform(async (documentKey) => {
  const document = await mediator.send<ConsulterDocumentProjetQuery>({
    type: 'Document.Query.ConsulterDocumentProjet',
    data: {
      documentKey,
    },
  });
  return document;
});

export const document = zod
  .instanceof(Blob)
  .refine(({ size }) => size > 0, `Le ficher est vide`)
  .refine(
    ({ size }) => size <= toBytes(defaultFileSizeLimitInMegaBytes),
    `Le fichier dépasse la taille maximale autorisée (${defaultFileSizeLimitInMegaBytes}Mo)`,
  );

export const optionalDocument = zod.instanceof(Blob);

/**
 * This type is used for form validation schema when a document can be updated.
 **/
export const keepOrUpdateDocument = zod
  .string()
  .or(document)
  .transform(async (documentKeyOrBlob) => {
    if (typeof documentKeyOrBlob === 'string') {
      const document = await mediator.send<ConsulterDocumentProjetQuery>({
        type: 'Document.Query.ConsulterDocumentProjet',
        data: {
          documentKey: documentKeyOrBlob,
        },
      });
      return document;
    }

    return {
      content: documentKeyOrBlob.stream(),
      format: documentKeyOrBlob.type,
    };
  });
