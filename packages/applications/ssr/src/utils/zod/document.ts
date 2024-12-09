import * as zod from 'zod';

export const defaultFileSizeLimitInMegaBytes = 5;

const toBytes = (sizeInMegaBytes: number): number => sizeInMegaBytes * 1024 * 1024;

type CommonOptions = {
  pdfOnly?: true;
};

type OptionalSingleDocumentSchema = zod.ZodEffects<zod.ZodType<Blob>, Blob | undefined>;
type RequiredSingleDocumentSchema = zod.ZodEffects<zod.ZodType<Blob>, Blob>;

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
  return zod
    .instanceof(Blob)
    .refine(({ size }) => (options?.optional ? size >= 0 : size > 0), `Champ obligatoire`)
    .refine(
      ({ size }) => size <= toBytes(defaultFileSizeLimitInMegaBytes),
      `Le fichier dépasse la taille maximale autorisée (${defaultFileSizeLimitInMegaBytes}Mo)`,
    )
    .refine(
      ({ type }) => (options?.pdfOnly ? type === 'application/pdf' : false),
      `Le format de fichier autorisé est : 'application/pdf'`,
    );
  // .transform(async (originalBlob) => {
  //   if (originalBlob.size === 0 || !options?.applyWatermark) {
  //     return originalBlob;
  //   }

  //   const watermarkedBlob = await FiligraneFacileClient.ajouterFiligrane(
  //     originalBlob,
  //     'potentiel.beta.gouv.fr',
  //   );

  //   return Option.match(watermarkedBlob)
  //     .some((watermarkedBlob) => watermarkedBlob)
  //     .none(() => originalBlob);
  // })
  // .transform((blob) => {
  //   if (blob.size === 0) {
  //     return undefined;
  //   }

  //   return {
  //     content: blob.stream(),
  //     format: blob.type,
  //   } as ConsulterDocumentProjetReadModel;
  // });
}

type ManyDocumentsOptions = {
  pdfOnly?: true;
  optional?: true;
};
export function manyDocuments(options?: ManyDocumentsOptions) {
  if (options?.optional) {
    return singleDocument({ optional: true, pdfOnly: options.pdfOnly })
      .transform((document) => [document])
      .or(
        singleDocument({
          optional: true,
          pdfOnly: options.pdfOnly,
        }).array(),
      );
    // .transform((documents) => documents.filter((document) => document !== undefined));
  }

  return singleDocument({
    pdfOnly: options?.pdfOnly,
  })
    .transform((document) => [document])
    .or(
      singleDocument({
        pdfOnly: options?.pdfOnly,
      })
        .array()
        .min(1, 'Champ obligatoire'),
    );
  // .transform((documents) => documents.filter((document) => document !== undefined));
}
