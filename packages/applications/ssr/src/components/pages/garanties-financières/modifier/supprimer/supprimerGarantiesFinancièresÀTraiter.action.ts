'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (_, { identifiantProjet }) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<GarantiesFinancières.SupprimerGarantiesFinancièresÀTraiterUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.SupprimerGarantiesFinancières',
      data: {
        identifiantProjetValue: identifiantProjet,
        suppriméLeValue: new Date().toISOString(),
        suppriméParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });
    return {
      status: 'success',
    };
  });

export const supprimerGarantiesFinancièresÀTraiterAction = formAction(action, schema);
