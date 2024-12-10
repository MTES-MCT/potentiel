import * as zod from 'zod';

import { ConsulterDocumentProjetReadModel } from '@potentiel-domain/document';

import {
  applyWatermark,
  mapToConsulterDocumentProjetReadModel,
  optionalBlob,
  requiredBlob,
} from './blob';

type CommonOptions = {
  applyWatermark?: true;
};

type OptionalSingleDocumentSchema = zod.ZodEffects<
  zod.ZodType<Blob>,
  ConsulterDocumentProjetReadModel | undefined
>;
type RequiredSingleDocumentSchema = zod.ZodEffects<
  zod.ZodType<Blob>,
  ConsulterDocumentProjetReadModel
>;

export function singleDocument(
  options: CommonOptions & {
    optional: true;
  },
): OptionalSingleDocumentSchema;
export function singleDocument(
  options?: CommonOptions & {
    optional?: undefined;
  },
): RequiredSingleDocumentSchema;
export function singleDocument(
  options?: CommonOptions & {
    optional?: true;
  },
): OptionalSingleDocumentSchema | RequiredSingleDocumentSchema {
  const blobSchema = options?.optional ? optionalBlob : requiredBlob;

  return blobSchema()
    .transform((blob) => (options?.optional ? applyWatermark(blob) : blob))
    .transform(mapToConsulterDocumentProjetReadModel);
}

const optionalBlobArray = optionalBlob()
  .transform((blob) => [blob])
  .or(optionalBlob().array());

const requiredBlobArray = requiredBlob()
  .transform((blob) => [blob])
  .or(requiredBlob().array().min(1, 'Champ obligatoire'));

export function manyDocuments(options?: { optional?: true; applyWatermark?: true }) {
  const blobArraySchema = options?.optional ? optionalBlobArray : requiredBlobArray;

  return blobArraySchema
    .transform(combinePdfs)
    .transform((blob) => (options?.optional ? applyWatermark(blob) : blob))
    .transform(mapToConsulterDocumentProjetReadModel);
}
