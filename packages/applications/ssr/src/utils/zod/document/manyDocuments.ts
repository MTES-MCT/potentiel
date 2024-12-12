import {
  applyWatermark,
  FileTypes,
  mapToConsulterDocumentProjetReadModel,
  mergePdfDocuments,
  optionalBlobArray,
  requiredBlobArray,
} from '../blob';

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
const buildOptionBlobArray = (options?: CommonOptions) =>
  optionalBlobArray(options)
    .transform((blobs) => blobs && mergePdfDocuments(blobs))
    .transform((blob) => (blob && options?.applyWatermark ? applyWatermark(blob) : blob))
    .transform((blob) => blob && mapToConsulterDocumentProjetReadModel(blob));

type RequiredManyDocumentSchema = ReturnType<typeof buildRequiredBlobArray>;
const buildRequiredBlobArray = (options?: CommonOptions) =>
  requiredBlobArray(options)
    .transform(mergePdfDocuments)
    .transform((blob) => (options?.applyWatermark ? applyWatermark(blob) : blob))
    .transform(mapToConsulterDocumentProjetReadModel);
