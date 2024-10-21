'use server';

// import { mediator } from 'mediateur';
import * as zod from 'zod';

// import { ChangementReprésentantLégal } from '@potentiel-domain/elimine';
// import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { document } from '@/utils/zod/documentTypes';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  reponseSignee: document,
});

export type RejeterChangementReprésentantLégalFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  // { identifiantProjet, reponseSignee },
) => {
  return withUtilisateur(async (_) => {
    // await mediator.send<ChangementReprésentantLégal.ChangementReprésentantLégalUseCase>({
    //   type: 'Éliminé.ChangementReprésentantLégal.UseCase.RejeterChangementReprésentantLégal',
    //   data: {
    //     identifiantProjetValue: identifiantProjet,
    //     identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
    //     dateRejetValue: new Date().toISOString(),
    //     réponseSignéeValue: {
    //       content: reponseSignee.stream(),
    //       format: reponseSignee.type,
    //     },
    //   },
    // });

    return {
      status: 'success',
      redirectUrl: '#', //Routes.ChangementReprésentantLégal.détail(identifiantProjet),
    };
  });
};

export const rejeterChangementReprésentantLégalAction = formAction(action, schema);
