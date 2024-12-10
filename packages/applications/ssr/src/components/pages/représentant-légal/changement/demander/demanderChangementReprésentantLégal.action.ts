'use server';

// import { mediator } from 'mediateur';
import * as zod from 'zod';

// import { ReprésentantLégal } from '@potentiel-domain/laureat';
// import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { manyDocuments } from '@/utils/zod/document/manyDocuments';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  typeRepresentantLegal: zod.enum(
    ['personne physique', 'personne morale', 'collectivité', 'autre'],
    {
      invalid_type_error: 'Ce type de représentant légal est invalide',
      required_error: 'Champ obligatoire',
    },
  ),
  nomRepresentantLegal: zod.string().min(1, { message: 'Champ obligatoire' }),
  pieceJustificative: manyDocuments(),
});

export type DemanderChangementReprésentantLégalFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async () =>
  /*previousState,
  { identifiantProjet pieceJustificative, nomReprésentantLégal },
   */
  {
    return withUtilisateur(async (/*utilisateur*/) => {
      // await mediator.send<ReprésentantLégal.DemanderChangementReprésentantLégalUseCase>({
      //   type: 'Lauréat.ReprésentantLégal.UseCase.DemanderChangementReprésentantLégal',
      //   data: {
      //     identifiantProjetValue: identifiantProjet,
      //     identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
      //     dateDemandeValue: new Date().toISOString(),
      //     nomReprésentantLégalValue: nomReprésentantLégal,
      //     pièceJustificativeValue: pieceJustificative,
      //   },
      // });

      return {
        status: 'success',
        redirectUrl: '' /*Routes.ReprésentantLégal.détail(identifiantProjet)*/,
      };
    });
  };

export const demanderChangementReprésentantLégalAction = formAction(action, schema);
