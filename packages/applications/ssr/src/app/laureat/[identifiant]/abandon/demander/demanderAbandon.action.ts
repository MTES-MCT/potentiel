'use server';
import { mediator } from 'mediateur';
import * as zod from 'zod';
import { redirect } from 'next/navigation';

import { Abandon } from '@potentiel-domain/laureat';

import { bootstrap } from '@/bootstrap';
import { FormState } from '@/utils/formAction';

bootstrap();

export type DemandeAbandonState = FormState;

const demanderAbandonSchema = zod.object({
  identifiantProjet: zod.string(),
  raison: zod.string().min(1).max(2000),
  recandidature: zod.preprocess((value) => value === 'on', zod.boolean()),
  pieceJustificative: zod.instanceof(Blob),
});

export async function demanderAbandonAction(
  previousState: DemandeAbandonState,
  formData: FormData,
): Promise<DemandeAbandonState | never> {
  try {
    const { identifiantProjet, raison, recandidature, pieceJustificative } =
      demanderAbandonSchema.parse(Object.fromEntries(formData));

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
  } catch (e) {
    if (e instanceof zod.ZodError) {
      return {
        error: `Impossible d'envoyer votre demande d'abandon`,
        validationErrors: e.issues.map((issue) => (issue.path.pop() || '').toString()),
      };
    }

    return {
      error: (e as Error).message,
      validationErrors: [],
    };
  }
}
