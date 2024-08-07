import * as zod from 'zod';
import { mediator } from 'mediateur';

import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

export const document = zod
  .string()
  .or(zod.instanceof(Blob).refine((data) => data.size > 0))
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
