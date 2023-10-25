'use server';
import { mediator } from 'mediateur';
import * as zod from 'zod';

import { bootstrap } from '@/bootstrap';
import { Abandon } from '@potentiel-domain/laureat';
import { FormState } from '@/utils/formAction';
import { redirect } from 'next/navigation';

bootstrap();

export type DetailsAbandonState = FormState;

const instructionAbandonSchema = zod.object({
  identifiantProjet: zod.string(),
  action: zod.enum(['confirmer', 'annuler']),
});

export async function detailsAbandonAction(prevState: DetailsAbandonState, formData: FormData) {
  try {
    const { action, identifiantProjet } = instructionAbandonSchema.parse(
      Object.fromEntries(formData),
    );

    switch (action) {
      case 'confirmer':
        await mediator.send<Abandon.AbandonUseCase>({
          type: 'CONFIRMER_ABANDON_USECASE',
          data: {
            identifiantProjetValue: identifiantProjet,
            utilisateurValue: 'pontoreau.sylvain@gmail.com',
            dateConfirmationValue: new Date().toISOString(),
          },
        });
        break;
      case 'annuler':
        await mediator.send<Abandon.AbandonUseCase>({
          type: 'ANNULER_ABANDON_USECASE',
          data: {
            identifiantProjetValue: identifiantProjet,
            utilisateurValue: 'pontoreau.sylvain@gmail.com',
            dateAnnulationValue: new Date().toISOString(),
          },
        });
        break;
    }

    return redirect(`/laureat/abandon/${encodeURIComponent(identifiantProjet)}/abandon/details`);
  } catch (e) {
    if (e instanceof zod.ZodError) {
      return {
        error: `Impossible d'instruire la demande d'abandon`,
        validationErrors: e.issues.map((issue) => (issue.path.pop() || '').toString()),
      };
    }

    return {
      error: (e as Error).message,
      validationErrors: [],
    };
  }
}
