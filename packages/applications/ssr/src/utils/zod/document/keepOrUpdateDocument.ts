import { mediator } from 'mediateur';
import * as zod from 'zod';

import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { Option } from '@potentiel-libraries/monads';

import { FileTypes } from '../blob';

import { manyDocuments } from './manyDocuments';
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

    if (Option.isNone(document)) {
      throw new Error(`Aucun document n'a été transmis`);
    }

    return document;
  });

type CommonOptions = {
  applyWatermark?: true;
  acceptedFileTypes?: Array<FileTypes>;
};

export const keepOrUpdateSingleDocument = (options?: CommonOptions) =>
  existingDocument.or(singleDocument(options));

export const keepOrUpdateManyDocuments = (options?: CommonOptions) =>
  existingDocument.or(manyDocuments(options));
