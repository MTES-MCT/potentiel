'use server';
import { mediator } from 'mediateur';
import * as zod from 'zod';
import { bootstrap } from '@/bootstrap';
import { redirect } from 'next/navigation';
import { Abandon } from '@potentiel-domain/laureat';
import { FormState } from '@/utils/formAction';

bootstrap();

export type InstructionAbandonState = FormState;

const instructionAbandonSchema = zod.object({
  identifiantProjet: zod.string(),
  instruction: zod.enum(['accorder', 'rejeter', 'demander-confirmation']),
  reponseSignee: zod.instanceof(Blob),
});

export async function instructionAbandonAction(
  previousState: InstructionAbandonState,
  formData: FormData,
) {
  try {
    const { identifiantProjet, instruction, reponseSignee } = instructionAbandonSchema.parse(
      Object.fromEntries(formData),
    );

    switch (instruction) {
      case 'rejeter':
        await mediator.send<Abandon.AbandonUseCase>({
          type: 'REJETER_ABANDON_USECASE',
          data: {
            identifiantProjetValue: identifiantProjet,
            utilisateurValue: 'pontoreau.sylvain@gmail.com',
            dateRejetValue: new Date().toISOString(),
            réponseSignéeValue: {
              content: reponseSignee.stream(),
              format: reponseSignee.type,
            },
          },
        });
        break;
      case 'accorder':
        await mediator.send<Abandon.AbandonUseCase>({
          type: 'ACCORDER_ABANDON_USECASE',
          data: {
            identifiantProjetValue: identifiantProjet,
            utilisateurValue: 'pontoreau.sylvain@gmail.com',
            dateAccordValue: new Date().toISOString(),
            réponseSignéeValue: {
              content: reponseSignee.stream(),
              format: reponseSignee.type,
            },
          },
        });
      case 'demander-confirmation':
        await mediator.send<Abandon.AbandonUseCase>({
          type: 'DEMANDER_CONFIRMATION_ABANDON_USECASE',
          data: {
            identifiantProjetValue: identifiantProjet,
            utilisateurValue: 'pontoreau.sylvain@gmail.com',
            dateDemandeValue: new Date().toISOString(),
            réponseSignéeValue: {
              content: reponseSignee.stream(),
              format: reponseSignee.type,
            },
          },
        });
        break;
    }
    return redirect('/laureat/abandon');
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
