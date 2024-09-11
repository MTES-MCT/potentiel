'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Recours } from '@potentiel-domain/elimine';

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
    await mediator.send<Recours.RecoursUseCase>({
      type: 'Éliminé.Recours.UseCase.AnnulerRecours',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateAnnulationValue: new Date().toISOString(),
      },
    });

    return {
      status: 'success',
    };
  });
};

export const annulerRecoursAction = formAction(action, schema);
