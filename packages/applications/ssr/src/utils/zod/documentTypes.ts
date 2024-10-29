import { mediator } from 'mediateur';
import * as zod from 'zod';

import {
  ConsulterDocumentProjetReadModel,
  ConsulterDocumentProjetQuery,
} from '@potentiel-domain/document';

export const defaultFileSizeLimitInMegaBytes = 5;

const toBytes = (sizeInMegaBytes: number): number => sizeInMegaBytes * 1024 * 1024;

export const documentZodSchema = (options?: { optional?: true }) => {
  return zod
    .instanceof(Blob)
    .refine(({ size }) => (options?.optional ? size >= 0 : size > 0), `Champ obligatoire`)
    .refine(
      ({ size }) => size <= toBytes(defaultFileSizeLimitInMegaBytes),
      `Le fichier dépasse la taille maximale autorisée (${defaultFileSizeLimitInMegaBytes}Mo)`,
    )
    .transform<ConsulterDocumentProjetReadModel>((blob) => ({
      content: blob.stream(),
      format: blob.type,
    }));
};

const documentKeyZodSchema = zod.string().transform(async (documentKey) => {
  const document = await mediator.send<ConsulterDocumentProjetQuery>({
    type: 'Document.Query.ConsulterDocumentProjet',
    data: {
      documentKey,
    },
  });

  return document;
});

export const keepOrUpdateDocument = documentKeyZodSchema.or(documentZodSchema());
export const keepOrUpdateManyDocuments = keepOrUpdateDocument
  .or(documentKeyZodSchema.array().min(1))
  .or(documentZodSchema().array().min(1));

/** @deprecated use documentZodSchema instead */
export const document = zod
  .instanceof(Blob)
  .refine(({ size }) => size > 0, `Le ficher est vide`)
  .refine(
    ({ size }) => size <= toBytes(defaultFileSizeLimitInMegaBytes),
    `Le fichier dépasse la taille maximale autorisée (${defaultFileSizeLimitInMegaBytes}Mo)`,
  );

/** @deprecated use documentZodSchema with optional instead */
export const optionalDocument = zod.instanceof(Blob);
