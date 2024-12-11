import * as zod from 'zod';

import { ConsulterDocumentProjetReadModel } from '@potentiel-domain/document';

import {
  applyWatermark,
  FileTypes,
  mapToConsulterDocumentProjetReadModel,
  optionalBlob,
  requiredBlob,
} from '../blob';

type CommonOptions = {
  applyWatermark?: true;
  acceptedFileTypes?: Array<FileTypes>;
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

  return blobSchema({ acceptedFileTypes: options?.acceptedFileTypes })
    .transform((blob) => (options?.applyWatermark ? applyWatermark(blob) : blob))
    .transform(mapToConsulterDocumentProjetReadModel);
}
