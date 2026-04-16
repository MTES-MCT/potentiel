'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (_, props) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.GarantiesFinancières.ValiderDépôtGarantiesFinancièresEnCoursUseCase>(
      {
        type: 'Lauréat.GarantiesFinancières.UseCase.ValiderDépôtGarantiesFinancièresEnCours',
        data: {
          identifiantProjetValue: props.identifiantProjet,
          validéLeValue: new Date().toISOString(),
          validéParValue: utilisateur.identifiantUtilisateur.formatter(),
        },
      },
    );

    return {
      status: 'success',
      redirection: { url: Routes.GarantiesFinancières.détail(props.identifiantProjet) },
    };
  });

export const validerDépôtGarantiesFinancièresAction = formAction(action, schema);
