'use server';
import { mediator } from 'mediateur';
import * as zod from 'zod';
import { redirect } from 'next/navigation';

import { Abandon } from '@potentiel-domain/laureat';

import { FormAction, FormState, formAction } from '@/utils/formAction';

const schema = zod.object({
  identifiantProjet: zod.string(),
  raison: zod.string().min(1).max(2000),
  recandidature: zod.preprocess((value) => value === 'on', zod.boolean()),
  pieceJustificative: zod.instanceof(Blob),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, pieceJustificative, raison, recandidature },
) => {
  await mediator.send<Abandon.AbandonUseCase>({
    type: 'DEMANDER_ABANDON_USECASE',
    data: {
      identifiantProjetValue: identifiantProjet,
      utilisateurValue: 'pontoreau.sylvain@gmail.com',
      dateDemandeValue: new Date().toISOString(),
      pièceJustificativeValue:
        pieceJustificative.size > 0
          ? {
              content: pieceJustificative.stream(),
              format: pieceJustificative.type,
            }
          : undefined,
      raisonValue: raison,
      recandidatureValue: recandidature || false,
    },
  });
  return redirect(`/laureat/abandon/${encodeURIComponent(identifiantProjet)}/abandon/details`);
};

export const demanderAbandonAction = formAction(action, schema);
