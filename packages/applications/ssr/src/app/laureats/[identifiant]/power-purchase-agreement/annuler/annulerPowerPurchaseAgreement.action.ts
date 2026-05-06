'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
});

export type AnnulerPowerPurchaseAgreementFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, { identifiantProjet }) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.PowerPurchaseAgreement.PowerPurchaseAgreementUseCase>({
      type: 'Lauréat.PowerPurchaseAgreement.UseCase.AnnulerPowerPurchaseAgreement',
      data: {
        identifiantProjetValue: identifiantProjet,
        annuléLeValue: new Date().toISOString(),
        annuléParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Lauréat.détails.tableauDeBord(identifiantProjet),
        message: "L'annulation du signalement PPA a été pris en compte",
      },
    };
  });

export const annulerPowerPurchaseAgreementAction = formAction(action, schema);
