'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet },
) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.GarantiesFinancières.AnnulerMainlevéeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.AnnulerMainlevée',
      data: {
        identifiantProjetValue: identifiantProjet,
        annuléLeValue: DateTime.now().formatter(),
        annuléParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.GarantiesFinancières.détail(identifiantProjet) },
    };
  });
};

export const annulerDemandeMainlevéeGarantiesFinancièresAction = formAction(action, schema);
