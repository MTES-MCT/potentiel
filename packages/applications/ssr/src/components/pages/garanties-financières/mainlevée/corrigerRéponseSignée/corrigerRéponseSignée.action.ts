'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { CorrigerDocumentProjetCommand } from '@potentiel-domain/document';
import { Routes } from '@potentiel-applications/routes';

import { singleDocument } from '@/utils/zod/document';
import { FormAction, formAction, FormState } from '@/utils/formAction';

const schema = zod.object({
  documentCorrige: singleDocument(),
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
