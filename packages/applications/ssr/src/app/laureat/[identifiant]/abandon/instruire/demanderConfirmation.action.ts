'use server';
import { mediator } from 'mediateur';
import * as zod from 'zod';
import { redirect } from 'next/navigation';
import { Abandon } from '@potentiel-domain/laureat';
import { FormState } from '@/utils/formAction';

export type DemanderConfirmationAbandonState = FormState;

const demanderConfirmationAbandonSchema = zod.object({
  identifiantProjet: zod.string(),
  reponseSignee: zod.instanceof(Blob),
  utilisateurValue: zod.string().email(),
});

export async function instructionAbandonAction(
  previousState: DemanderConfirmationAbandonState,
  formData: FormData,
) {
  try {
    const { identifiantProjet, reponseSignee, utilisateurValue } =
      demanderConfirmationAbandonSchema.parse(Object.fromEntries(formData));

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
  } catch (e) {
    if (e instanceof zod.ZodError) {
      return {
        error: `Impossible d'envoyer une demande de confirmation d'abandon.`,
        validationErrors: e.issues.map((issue) => (issue.path.pop() || '').toString()),
      };
    }

    return {
      error: (e as Error).message,
      validationErrors: [],
    };
  }

  const queryParams = new URLSearchParams({
    success: `Votre demande de confirmation d'abandon a bien été transmise.`,
  }).toString();

  redirect(
    `/laureat/${encodeURIComponent(
      demanderConfirmationAbandonSchema.parse(Object.fromEntries(formData)).identifiantProjet,
    )}/abandon?${queryParams}`,
  );
}
