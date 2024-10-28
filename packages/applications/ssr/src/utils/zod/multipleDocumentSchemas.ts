import { mediator } from 'mediateur';
import * as zod from 'zod';

import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

export const DEFAULT_FILE_SIZE_LIMIT_IN_MB = 5;

export const DEFAULT_FILE_SIZE_LIMIT_FOR_ZOD = DEFAULT_FILE_SIZE_LIMIT_IN_MB * 1024 * 1024;

export const requiredNonEmpyMultipleDocuments = zod
  .array(
    zod.instanceof(File).refine(({ size }) => size <= DEFAULT_FILE_SIZE_LIMIT_FOR_ZOD, {
      message: `Le fichier dépasse la taille maximale autorisée (${DEFAULT_FILE_SIZE_LIMIT_IN_MB}Mo)`,
    }),
  )
  .min(1);

/**
 * This type is used for form validation schema when a document can be updated.
 **/
export const keepOrUpdateMultipleDocuments = zod
  .string()
  .or(requiredNonEmpyMultipleDocuments)
  .transform(async (documentKeyListOrDocuments) => {
    if (typeof documentKeyListOrDocuments === 'string') {
      const documents = await Promise.all(
        documentKeyListOrDocuments.split('|').map(async () => {
          const document = await mediator.send<ConsulterDocumentProjetQuery>({
            type: 'Document.Query.ConsulterDocumentProjet',
            data: {
              documentKey: documentKeyListOrDocuments,
            },
          });
          return document;
        }),
      );

      return documents;
    }

    const documents = documentKeyListOrDocuments.map((file) => ({
      content: file.stream(),
      format: file.type,
    }));

    return documents;
  });
