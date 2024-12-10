import { mediator } from 'mediateur';
import * as zod from 'zod';

import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { singleDocument } from './document';

const documentKey = zod
  .string()
  .min(1, 'Champ obligatoire')
  .transform(async (documentKey) => {
    const document = await mediator.send<ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey,
      },
    });

    return document;
  });

export const keepOrUpdateSingleDocument = documentKey.or(singleDocument());
