'use server';
import { mediator } from 'mediateur';
import * as zod from 'zod';
import { redirect } from 'next/navigation';
import { Abandon } from '@potentiel-domain/laureat';
import { FormState } from '@/utils/formAction';

export type InstructionAbandonState = FormState;

const instructionAbandonSchema = zod.object({
  identifiantProjet: zod.string(),
  instruction: zod.enum(['demander-confirmation']),
  reponseSignee: zod.instanceof(Blob),
  utilisateurValue: zod.string().email(),
});

export async function instructionAbandonAction(
  previousState: InstructionAbandonState,
  formData: FormData,
) {
  try {
    const { identifiantProjet, instruction, reponseSignee, utilisateurValue } =
      instructionAbandonSchema.parse(Object.fromEntries(formData));

    switch (instruction) {
      // case 'rejeter':
      //   await mediator.send<Abandon.AbandonUseCase>({
      //     type: 'REJETER_ABANDON_USECASE',
      //     data: {
      //       identifiantProjetValue: identifiantProjet,
      //       utilisateurValue,
      //       dateRejetValue: new Date().toISOString(),
      //       réponseSignéeValue: {
      //         content: reponseSignee.stream(),
      //         format: reponseSignee.type,
      //       },
      //     },
      //   });
      //   break;
      // TODO : pour débloquer la partie accorder il faut :
      // - pouvoir générer le document "accord abandon avec recandidature"
      // - pouvoir mettre à jour le projet legacy

      // case 'accorder':
      //   await mediator.send<Abandon.AbandonUseCase>({
      //     type: 'ACCORDER_ABANDON_USECASE',
      //     data: {
      //       identifiantProjetValue: identifiantProjet,
      //       utilisateurValue,
      //       dateAccordValue: new Date().toISOString(),
      //       réponseSignéeValue: {
      //         content: reponseSignee.stream(),
      //         format: reponseSignee.type,
      //       },
      //     },
      //   });
      //   break;
      case 'demander-confirmation':
        await mediator.send<Abandon.AbandonUseCase>({
          type: 'DEMANDER_CONFIRMATION_ABANDON_USECASE',
          data: {
            identifiantProjetValue: identifiantProjet,
            utilisateurValue,
            dateDemandeValue: new Date().toISOString(),
            réponseSignéeValue: {
              content: reponseSignee.stream(),
              format: reponseSignee.type,
            },
          },
        });
        break;
    }
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

  const queryParams = new URLSearchParams({
    success: 'Votre réponse a bien été transmise',
  }).toString();

  redirect(
    `/laureat/${encodeURIComponent(
      instructionAbandonSchema.parse(Object.fromEntries(formData)).identifiantProjet,
    )}/abandon/details?${queryParams}`,
  );
}
