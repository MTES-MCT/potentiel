'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import type { CorrigerDocumentProjetCommand } from '@potentiel-domain/document';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  documentCorrige: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
  courrierReponseACorriger: zod.string().min(1),
  identifiantProjet: zod.string().min(1),
});

export type CorrigerRéponseSignéeFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, courrierReponseACorriger, documentCorrige },
) => {
  await mediator.send<CorrigerDocumentProjetCommand>({
    type: 'Document.Command.CorrigerDocumentProjet',
    data: {
      content: documentCorrige.content,
      documentProjetKey: courrierReponseACorriger,
    },
  });

  return {
    status: 'success',
    redirection: { url: Routes.GarantiesFinancières.détail(identifiantProjet) },
  };
};

export const corrigerRéponseSignéeAction = formAction(action, schema);
