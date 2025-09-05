'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  motif: zod.enum(['projet-abandonné', 'projet-achevé']),
});

const action: FormAction<FormState, typeof schema> = async (_, { identifiantProjet, motif }) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.GarantiesFinancières.DemanderMainlevéeGarantiesFinancièresUseCase>({
      type: 'Lauréat.GarantiesFinancières.UseCase.DemanderMainlevée',
      data: {
        identifiantProjetValue: identifiantProjet,
        demandéLeValue: new Date().toISOString(),
        demandéParValue: utilisateur.identifiantUtilisateur.formatter(),
        motifValue: motif,
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.GarantiesFinancières.détail(identifiantProjet) },
    };
  });

export const demanderMainlevéeAction = formAction(action, schema);
