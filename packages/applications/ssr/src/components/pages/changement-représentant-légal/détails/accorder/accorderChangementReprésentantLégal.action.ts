'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { ChangementReprésentantLégal } from '@potentiel-domain/elimine';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { document } from '@/utils/zod/documentTypes';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  reponseSignee: document,
});

export type AccorderChangementReprésentantLégalFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, reponseSignee },
) => {
  return withUtilisateur(async (utilisateur) => {
    const réponseSignéeValue = {
      content: reponseSignee.stream(),
      format: reponseSignee.type,
    };

    await mediator.send<ChangementReprésentantLégal.AccorderChangementReprésentantLégalUseCase>({
      type: 'Éliminé.ChangementReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateAccordValue: new Date().toISOString(),
        réponseSignéeValue,
      },
    });

    return {
      status: 'success',
      redirectUrl: Routes.ChangementReprésentantLégal.détail(identifiantProjet),
    };
  });
};

export const accorderChangementReprésentantLégalAction = formAction(action, schema);
