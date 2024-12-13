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

type OptionalSingleDocumentSchema = ReturnType<typeof buildOptionBlob>;
type RequiredSingleDocumentSchema = ReturnType<typeof buildRequiredBlob>;

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
  return options?.optional ? buildOptionBlob(options) : buildRequiredBlob(options);
}

const buildOptionBlob = (options?: CommonOptions) =>
  optionalBlob(options)
    .transform((blob) => (blob.size === 0 ? undefined : blob))
    .transform((blob) => (blob && options?.applyWatermark ? applyWatermark(blob) : blob))
    .transform((blob) => blob && mapToConsulterDocumentProjetReadModel(blob));

const buildRequiredBlob = (options?: CommonOptions) =>
  requiredBlob(options)
    .transform((blob) => (options?.applyWatermark ? applyWatermark(blob) : blob))
    .transform(mapToConsulterDocumentProjetReadModel);
