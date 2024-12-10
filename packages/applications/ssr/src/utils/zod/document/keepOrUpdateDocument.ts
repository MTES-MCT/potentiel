import { mediator } from 'mediateur';
import * as zod from 'zod';

import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { singleDocument } from './singleDocument';

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
export const keepOrUpdateManyDocuments = keepOrUpdateSingleDocument
  .transform((document) => [document])
  .or(zod.array(keepOrUpdateSingleDocument).min(1, 'Champ obligatoire'));
