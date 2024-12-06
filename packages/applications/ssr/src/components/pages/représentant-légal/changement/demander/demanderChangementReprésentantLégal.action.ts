'use server';

import { PDFDocument } from 'pdf-lib';
import * as zod from 'zod';
import { mediator } from 'mediateur';

import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { ConsulterDocumentProjetReadModel } from '@potentiel-domain/document';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { manyDocuments } from '@/utils/zod/document';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  typeRepresentantLegal: zod.enum(ReprésentantLégal.TypeReprésentantLégal.types, {
    invalid_type_error: 'Le type de réprésentant légal est invalide',
    required_error: 'Champ obligatoire',
  }),
  nomRepresentantLegal: zod.string().min(1, { message: 'Champ obligatoire' }),
  piecesJustificatives: manyDocuments(),
});

export type DemanderChangementReprésentantLégalFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, nomRepresentantLegal, typeRepresentantLegal, piecesJustificatives },
) =>
  withUtilisateur(async (utilisateur) => {
    console.log('😾😾😾😾😾😾😾');
    const content = await combinePDFs(piecesJustificatives);

    await mediator.send<ReprésentantLégal.ReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.DemanderChangementReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        nomReprésentantLégalValue: nomRepresentantLegal,
        typeReprésentantLégalValue: typeRepresentantLegal,
        pièceJustificativeValue: {
          content,
          format: 'application/pdf',
        },
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateDemandeValue: new Date().toISOString(),
      },
    });
    return {
      status: 'success',
      redirection: {
        url: Routes.ReprésentantLégal.détail(identifiantProjet),
        message: 'La demande de changement de représentant légal a bien été transmise',
      },
    };
  });

export const demanderChangementReprésentantLégalAction = formAction(action, schema);

async function combinePDFs(
  piecesJustificatives: Array<ConsulterDocumentProjetReadModel>,
): Promise<ReadableStream> {
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

  return new ReadableStream({
    start(controller) {
      controller.enqueue(combinedPdfBytes);
      controller.close();
    },
  });
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
