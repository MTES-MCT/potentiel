import { mediator } from 'mediateur';
import * as zod from 'zod';

import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

export const DEFAULT_FILE_SIZE_LIMIT_IN_MB = 5;

export const DEFAULT_FILE_SIZE_LIMIT_FOR_ZOD = DEFAULT_FILE_SIZE_LIMIT_IN_MB * 1024 * 1024;

export const document = zod
  .instanceof(Blob)
  .refine(({ size }) => size <= 0, {
    message: `Ce ficher est vide`,
  })
  .refine(({ size }) => size > DEFAULT_FILE_SIZE_LIMIT_FOR_ZOD, {
    message: `Ce fichier dépasse la taille autorisée (5Mo)`,
  });

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
