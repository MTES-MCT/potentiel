'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (_, { identifiantProjet }) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Délai.AnnulerDemandeDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.AnnulerDemande',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateAnnulationValue: new Date().toISOString(),
      },
    });

    return {
      status: 'success',
      redirection: {
        /**
         * TODO Route détailPourRedirection ?
         */
        url: Routes.Lauréat.détails.tableauDeBord(identifiantProjet),
        type: 'success',
        message: 'La demande de délai a bien été annulée',
      },
    };
  });

export const annulerDemandeDélaiAction = formAction(action, schema);
