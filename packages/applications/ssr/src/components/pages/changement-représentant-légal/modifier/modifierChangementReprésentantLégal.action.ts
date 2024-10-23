'use server';

// import { mediator } from 'mediateur';
import * as zod from 'zod';

// import { ReprésentantLégal } from '@potentiel-domain/laureat';
// import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { document } from '@/utils/zod/documentTypes';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  typeDePersonne: zod.enum(['Personne physique', 'Personne morale', 'Collectivité', 'Autre'], {
    invalid_type_error: 'Ce type de personne est invalide',
    required_error: 'Champ obligatoire',
  }),
  nomRepresentantLegal: zod.string().min(1, { message: 'Champ obligatoire' }),
  pieceJustificative: document,
});

export type ModifierChangementReprésentantLégalFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async () =>
  /*previousState,
  { identifiantProjet pieceJustificative, nomReprésentantLégal },
   */
  {
    return withUtilisateur(async (/*utilisateur*/) => {
      // await mediator.send<ReprésentantLégal.ModifierChangementReprésentantLégalUseCase>({
      //   type: 'Lauréat.ReprésentantLégal.UseCase.ModifierChangementReprésentantLégal',
      //   data: {
      //     identifiantProjetValue: identifiantProjet,
      //     identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
      //     dateDemandeValue: new Date().toISOString(),
      //     nomReprésentantLégalValue: nomReprésentantLégal,
      //     pièceJustificativeValue: {
      //       content: pieceJustificative.stream(),
      //       format: pieceJustificative.type,
      //     },
      //   },
      // });

      return {
        status: 'success',
        redirectUrl: '' /*Routes.ReprésentantLégal.détail(identifiantProjet)*/,
      };
    });
  };

export const modifierChangementReprésentantLégalAction = formAction(action, schema);
