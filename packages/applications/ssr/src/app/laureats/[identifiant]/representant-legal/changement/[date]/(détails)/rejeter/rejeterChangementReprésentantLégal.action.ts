'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  motifRejet: zod.string().min(1),
});

export type RejeterChangementReprésentantLégalFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, motifRejet },
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
        url: Routes.Projet.details(identifiantProjet),
        message: 'Le changement de représentant légal a bien été rejeté',
      },
    };
  });
};

export const rejeterChangementReprésentantLégalAction = formAction(action, schema);
