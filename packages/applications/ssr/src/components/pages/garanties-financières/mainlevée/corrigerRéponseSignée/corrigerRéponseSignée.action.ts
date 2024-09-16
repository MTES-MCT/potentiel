'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { CorrigerDocumentProjetCommand } from '@potentiel-domain/document';

import { FormAction, formAction, FormState } from '@/utils/formAction';

const schema = zod.object({
  documentCorrige: zod.instanceof(Blob).refine((file) => file.size > 0),
  courrierReponseACorriger: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (
  _,
  { courrierReponseACorriger, documentCorrige },
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
  };
};

export const corrigerRéponseSignéeAction = formAction(action, schema);
