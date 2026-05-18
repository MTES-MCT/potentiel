'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
});
export type SignalerPowerPurchaseAgreementFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, { identifiantProjet }) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.PowerPurchaseAgreement.PowerPurchaseAgreementUseCase>({
      type: 'Lauréat.PowerPurchaseAgreement.UseCase.SignalerPowerPurchaseAgreement',
      data: {
        identifiantProjetValue: identifiantProjet,
        signaléLeValue: new Date().toISOString(),
        signaléParValue: utilisateur.identifiantUtilisateur.formatter(),
        rôleUtilisateurValue: utilisateur.rôle.nom,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Lauréat.détails.tableauDeBord(identifiantProjet),
        message:
          "Le projet a bien été signalé comme étant signataire d'un PPA (contrat de vente de gré à gré)",
      },
    };
  });

export const signalerPowerPurchaseAgreementAction = formAction(action, schema);
