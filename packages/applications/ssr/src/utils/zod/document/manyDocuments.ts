import * as zod from 'zod';

import { ConsulterDocumentProjetReadModel } from '@potentiel-domain/document';

import {
  applyWatermark,
  mapToConsulterDocumentProjetReadModel,
  mergePdfDocuments,
  optionalBlobArray,
  requiredBlobArray,
} from '../blob';

type CommonOptions = {
  applyWatermark?: true;
};

type OptionalManyDocumentSchema = zod.ZodEffects<
  zod.ZodEffects<
    zod.ZodEffects<
      zod.ZodArray<zod.ZodEffects<zod.ZodType<Blob, zod.ZodTypeDef, Blob>, Blob, Blob>, 'many'>,
      Blob,
      Blob[]
    >,
    Blob,
    Blob[]
  >,
  ConsulterDocumentProjetReadModel | undefined,
  Blob[]
>;
type RequiredManyDocumentSchema = zod.ZodEffects<
  zod.ZodEffects<
    zod.ZodEffects<
      zod.ZodArray<zod.ZodEffects<zod.ZodType<Blob, zod.ZodTypeDef, Blob>, Blob, Blob>, 'many'>,
      Blob,
      Blob[]
    >,
    Blob,
    Blob[]
  >,
  ConsulterDocumentProjetReadModel,
  Blob[]
>;

export function manyDocuments(
  options: CommonOptions & {
    optional: true;
  },
): OptionalManyDocumentSchema;
export function manyDocuments(
  options?: CommonOptions & {
    optional?: undefined;
  },
): RequiredManyDocumentSchema;
export function manyDocuments(
  options?: CommonOptions & {
    optional?: true;
  },
): OptionalManyDocumentSchema | RequiredManyDocumentSchema {
  const blobArraySchema = options?.optional ? optionalBlobArray : requiredBlobArray;

  const newLocal = blobArraySchema
    .transform(mergePdfDocuments)
    .transform((blob) => (options?.applyWatermark ? applyWatermark(blob) : blob))
    .transform(mapToConsulterDocumentProjetReadModel);

  return newLocal;
}
