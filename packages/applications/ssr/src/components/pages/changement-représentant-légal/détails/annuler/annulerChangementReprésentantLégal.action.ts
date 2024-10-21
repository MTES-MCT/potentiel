'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { ChangementReprésentantLégal } from '@potentiel-domain/elimine';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (_, { identifiantProjet }) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<ChangementReprésentantLégal.ChangementReprésentantLégalUseCase>({
      type: 'Éliminé.ChangementReprésentantLégal.UseCase.AnnulerChangementReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateAnnulationValue: new Date().toISOString(),
      },
    });

    return {
      status: 'success',
      redirectUrl: Routes.Projet.details(identifiantProjet),
    };
  });
};

export const annulerChangementReprésentantLégalAction = formAction(action, schema);
