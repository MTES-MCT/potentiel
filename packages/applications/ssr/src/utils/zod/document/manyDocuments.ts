import {
  applyWatermark,
  FileTypes,
  mapToConsulterDocumentProjetReadModel,
  mergePdfDocuments,
  optionalBlobArray,
  requiredBlobArray,
} from '../blob';
import { OptionalBlobArray } from '../blob/optionalBlob';
import { RequiredBlobArray } from '../blob/requiredBlob';

type CommonOptions = {
  applyWatermark?: true;
  acceptedFileTypes?: Array<FileTypes>;
};

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
  return options?.optional ? buildOptionBlobArray(options) : buildRequiredBlobArray(options);
}

type OptionalManyDocumentSchema = ReturnType<typeof buildOptionBlobArray>;
const buildOptionBlobArray = (options?: CommonOptions) => buildSchema(optionalBlobArray, options);

type RequiredManyDocumentSchema = ReturnType<typeof buildRequiredBlobArray>;
const buildRequiredBlobArray = (options?: CommonOptions) => buildSchema(requiredBlobArray, options);

const buildSchema = (schema: OptionalBlobArray | RequiredBlobArray, options?: CommonOptions) =>
  schema(options)
    .transform(mergePdfDocuments)
    .transform((blob) => (options?.applyWatermark ? applyWatermark(blob) : blob))
    .transform(mapToConsulterDocumentProjetReadModel);
