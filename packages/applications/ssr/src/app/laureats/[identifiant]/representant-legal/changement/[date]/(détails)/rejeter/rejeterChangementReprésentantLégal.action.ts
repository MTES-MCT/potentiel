'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  dateDemande: zod.string().min(1),
  motifRejet: zod.string().min(1),
});

export type RejeterChangementReprésentantLégalFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, dateDemande, motifRejet },
) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.ReprésentantLégal.ReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.RejeterChangementReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        motifRejetValue: motifRejet,
        dateRejetValue: new Date().toISOString(),
        rejetAutomatiqueValue: false,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.ReprésentantLégal.changement.détails(identifiantProjet, dateDemande),
        message: 'Le changement de représentant légal a bien été rejeté',
      },
    };
  });
};

export const rejeterChangementReprésentantLégalAction = formAction(action, schema);
