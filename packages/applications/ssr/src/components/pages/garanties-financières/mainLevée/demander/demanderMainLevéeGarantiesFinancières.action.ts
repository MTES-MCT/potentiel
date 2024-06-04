'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  motif: zod.enum(['projet-abandonné', 'projet-achevé']),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, motif },
) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<GarantiesFinancières.DemanderMainLevéeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.MainLevée.UseCase.Demander',
      data: {
        identifiantProjetValue: identifiantProjet,
        demandéLeValue: new Date().toISOString(),
        demandéParValue: utilisateur.identifiantUtilisateur.formatter(),
        motifValue: motif,
      },
    });

    return {
      status: 'success',
    };
  });
};

export const demanderMainLevéeGarantiesFinancièresAction = formAction(action, schema);
