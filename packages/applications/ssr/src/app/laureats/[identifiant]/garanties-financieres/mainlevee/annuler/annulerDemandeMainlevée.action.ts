'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (
  _previousState,
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
