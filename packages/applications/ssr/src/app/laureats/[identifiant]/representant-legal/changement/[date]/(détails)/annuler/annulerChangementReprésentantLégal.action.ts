'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import { getContext } from '@potentiel-applications/request-context';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (_, { identifiantProjet }) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.ReprésentantLégal.AnnulerChangementReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.AnnulerChangementReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateAnnulationValue: new Date().toISOString(),
      },
    });

    const { url } = getContext() ?? {};

    return {
      status: 'success',
      redirection: {
        url: url ?? Routes.Lauréat.détails(identifiantProjet),
        message: 'La demande de changement de représentant légal a bien été annulée',
      },
    };
  });
};

export const annulerChangementReprésentantLégalAction = formAction(action, schema);
