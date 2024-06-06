'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

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
    await mediator.send<GarantiesFinancières.AnnulerMainLevéeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.MainLevée.UseCase.Annuler',
      data: {
        identifiantProjetValue: identifiantProjet,
        // violette voir si on ajoute ces valeurs
        // annuléLeValue: new Date().toISOString(),
        // annuléParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
    };
  });
};

export const annulerMainLevéeGarantiesFinancièresAction = formAction(action, schema);
