'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';
import { Abandon } from '@potentiel-domain/laureat';
import { FormAction, FormState, formAction } from '@/utils/formAction';
import { getAccessToken } from '@/utils/getAccessToken';

export type DemanderAbandonState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string(),
  recandidature: zod.string().optional(),
  raison: zod.string(),
  pieceJustificative: zod.instanceof(Blob),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, pieceJustificative, recandidature, raison },
) => {
  await mediator.send<Abandon.AbandonUseCase>({
    type: 'DEMANDER_ABANDON_USECASE',
    data: {
      identifiantProjetValue: identifiantProjet,
      utilisateurValue: await getAccessToken(),
      dateDemandeValue: new Date().toISOString(),
      raisonValue: raison,
      recandidatureValue: recandidature === 'true' ? true : false,
      ...(pieceJustificative.size > 0 && {
        pièceJustificativeValue: {
          content: pieceJustificative.stream(),
          format: pieceJustificative.type,
        },
      }),
    },
  });

  return previousState;
};

export const demanderAbandonAction = formAction(action, schema);
