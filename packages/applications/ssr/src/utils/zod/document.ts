import * as zod from 'zod';
import { PDFDocument } from 'pdf-lib';

import { Option } from '@potentiel-libraries/monads';
import { ConsulterDocumentProjetReadModel } from '@potentiel-domain/document';
import { FiligraneFacileClient } from '@potentiel-infrastructure/filigrane-facile-client';

export const defaultFileSizeLimitInMegaBytes = 5;

const toBytes = (sizeInMegaBytes: number): number => sizeInMegaBytes * 1024 * 1024;

type CommonOptions = {
  applyWatermark?: true;
  pdfOnly?: true;
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
    .refine(
      ({ type }) => (options?.pdfOnly ? type === 'application/pdf' : false),
      `Le format de fichier autorisé est : 'application/pdf'`,
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

type ManyDocumentsOptions = {
  optional?: true;
  applyWatermark?: true;
};

export function manyDocuments(options?: ManyDocumentsOptions) {
  // here

  // if (options?.optional) {
  //   singleDocument({ optional: true, pdfOnly: true })
  //     .transform((document) => [document])
  //     .or(
  //       singleDocument({
  //         optional: true,
  //         pdfOnly: true,
  //       }).array(),
  //     );
  // }

  return singleDocument({
    pdfOnly: true,
  })
    .transform((document) => [document])
    .or(
      singleDocument({
        pdfOnly: true,
      })
        .array()
        .min(1, 'Champ obligatoire'),
    )
    .transform((documents) => combinePDFs(documents))
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

async function combinePDFs(
  piecesJustificatives: Array<ConsulterDocumentProjetReadModel>,
): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();

  for (const piece of piecesJustificatives) {
    const pdfBytes = await streamToArrayBuffer(piece.content);
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => {
      pdfDoc.addPage(page);
    });
  }

  const combinedPdfBytes = await pdfDoc.save();

  return new Blob([combinedPdfBytes], { type: 'application/pdf' });

  // return {
  //   content: new ReadableStream({
  //     start(controller) {
  //       controller.enqueue(combinedPdfBytes);
  //       controller.close();
  //     },
  //   }),
  //   format: 'application/pdf',
  // } as ConsulterDocumentProjetReadModel;
}

async function streamToArrayBuffer(stream: ReadableStream): Promise<ArrayBuffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    if (value) {
      chunks.push(value);
    }
    done = doneReading;
  }

  const combined = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  return combined.buffer;
}
