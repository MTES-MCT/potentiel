import { mediator } from 'mediateur';
import * as zod from 'zod';

import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { FileTypes } from '../blob';

import { singleDocument } from './singleDocument';

const existingDocument = zod
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

type CommonOptions = {
  applyWatermark?: true;
  acceptedFileTypes?: Array<FileTypes>;
};

export const keepOrUpdateSingleDocument = (options?: CommonOptions) =>
  existingDocument.or(singleDocument(options));

export const keepOrUpdateManyDocuments = (options?: CommonOptions) =>
  keepOrUpdateSingleDocument(options)
    .transform((document) => [document])
    .or(zod.array(keepOrUpdateSingleDocument(options)).min(1, 'Champ obligatoire'));
