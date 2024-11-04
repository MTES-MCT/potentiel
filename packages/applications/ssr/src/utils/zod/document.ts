import * as zod from 'zod';

import { Option } from '@potentiel-libraries/monads';
import { ConsulterDocumentProjetReadModel } from '@potentiel-domain/document';
import { FiligraneFacileClient } from '@potentiel-infrastructure/filigrane-facile-client';

export const defaultFileSizeLimitInMegaBytes = 5;

const toBytes = (sizeInMegaBytes: number): number => sizeInMegaBytes * 1024 * 1024;

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
  return zod
    .instanceof(Blob)
    .refine(({ size }) => (options?.optional ? size >= 0 : size > 0), `Champ obligatoire`)
    .refine(
      ({ size }) => size <= toBytes(defaultFileSizeLimitInMegaBytes),
      `Le fichier dépasse la taille maximale autorisée (${defaultFileSizeLimitInMegaBytes}Mo)`,
    )
    .transform(async (originalBlob) => {
      if (originalBlob.size === 0 || !options?.applyWatermark) {
        return originalBlob;
      }

      const watermarkedBlob = await FiligraneFacileClient.ajouterFiligrane(
        originalBlob,
        'potentiel.beta.gouv.fr',
      );

      return Option.match(watermarkedBlob)
        .some((watermarkedBlob) => watermarkedBlob)
        .none(() => originalBlob);
    })
    .transform((blob) => {
      if (blob.size === 0) {
        return undefined;
      }

      return {
        content: blob.stream(),
        format: blob.type,
      } as ConsulterDocumentProjetReadModel;
    });
}

export function manyDocuments(options?: { optional?: true }) {
  if (options?.optional) {
    singleDocument({ optional: true })
      .transform((document) => [document])
      .or(singleDocument({ optional: true }).array());
  }

  return singleDocument()
    .transform((document) => [document])
    .or(singleDocument().array().min(1, 'Champ obligatoire'));
}
