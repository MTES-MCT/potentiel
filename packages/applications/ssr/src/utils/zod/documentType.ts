import * as zod from 'zod';
import { mediator } from 'mediateur';

import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { validateDocumentSize } from './documentValidation';

/**
 * This type is used for form validation schema when a document can be updated.
 **/
export const document = zod
  .string()
  .or(zod.instanceof(Blob).superRefine((file, ctx) => validateDocumentSize(file, ctx)))
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
