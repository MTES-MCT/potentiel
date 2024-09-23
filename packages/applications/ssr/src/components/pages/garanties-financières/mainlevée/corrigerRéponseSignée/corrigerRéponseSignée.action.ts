'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { CorrigerDocumentProjetCommand } from '@potentiel-domain/document';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { validateDocumentSize } from '@/utils/zod/documentError';

const schema = zod.object({
  documentCorrige: zod.instanceof(Blob).superRefine((file, ctx) => validateDocumentSize(file, ctx)),
  courrierReponseACorriger: zod.string().min(1),
  identifiantProjet: zod.string(),
});

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, courrierReponseACorriger, documentCorrige },
) => {
  await mediator.send<CorrigerDocumentProjetCommand>({
    type: 'Document.Command.CorrigerDocumentProjet',
    data: {
      content: documentCorrige.stream(),
      documentProjetKey: courrierReponseACorriger,
    },
  });

  return {
    status: 'success',
    redirectUrl: Routes.GarantiesFinancières.détail(identifiantProjet),
  };
};

export const corrigerRéponseSignéeAction = formAction(action, schema);
