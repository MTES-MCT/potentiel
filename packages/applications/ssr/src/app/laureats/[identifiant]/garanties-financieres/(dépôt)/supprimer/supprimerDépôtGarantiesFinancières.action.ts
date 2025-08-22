'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import type { GarantiesFinancières } from '@potentiel-domain/laureat';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (_, props) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<GarantiesFinancières.GarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.SupprimerGarantiesFinancièresÀTraiter',
      data: {
        identifiantProjetValue: props.identifiantProjet,
        suppriméLeValue: new Date().toISOString(),
        suppriméParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.GarantiesFinancières.détail(props.identifiantProjet) },
    };
  });

export const supprimerDépôtGarantiesFinancièresAction = formAction(action, schema);
