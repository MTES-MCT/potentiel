'use server';

// import { mediator } from 'mediateur';
import * as zod from 'zod';

// import { ChangementReprésentantLégal } from '@potentiel-domain/elimine';
// import { Routes } from '@potentiel-applications/routes';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  typeRepresentantLegal: zod.enum(ReprésentantLégal.TypeReprésentantLégal.types, {
    invalid_type_error: 'Ce type de réprésentant légal est invalide',
    required_error: 'Champ obligatoire',
  }),
  nomRepresentantLegal: zod.string().min(1, { message: 'Champ obligatoire' }),
});

export type AccorderChangementReprésentantLégalFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_) =>
  withUtilisateur(async (_) => {
    // await mediator.send<ChangementReprésentantLégal.AccorderChangementReprésentantLégalUseCase>({
    //   type: 'Éliminé.ChangementReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
    //   data: {
    //     identifiantProjetValue: identifiantProjet,
    //     identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
    //     dateAccordValue: new Date().toISOString(),
    //     réponseSignéeValue: réponseSignée,
    //   },
    // });

    return {
      status: 'success',
      redirectUrl: '#', // Routes.ChangementReprésentantLégal.détail(identifiantProjet),
    };
  });

export const accorderChangementReprésentantLégalAction = formAction(action, schema);
