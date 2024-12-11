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

const buildOptionBlob = (options?: CommonOptions) => buildSchema(optionalBlob, options);
const buildRequiredBlob = (options?: CommonOptions) => buildSchema(requiredBlob, options);

const buildSchema = (schema: typeof optionalBlob | typeof requiredBlob, options?: CommonOptions) =>
  schema(options)
    .transform((blob) => (options?.applyWatermark ? applyWatermark(blob) : blob))
    .transform(mapToConsulterDocumentProjetReadModel);
