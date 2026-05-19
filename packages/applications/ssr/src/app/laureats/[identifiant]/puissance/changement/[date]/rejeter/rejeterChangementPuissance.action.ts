'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  reponseSignee: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
  estUneDecisionDEtat: zod.literal('true').optional(),
});

export type RejeterChangementPuissanceFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, reponseSignee, estUneDecisionDEtat },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Puissance.RejeterChangementPuissanceUseCase>({
      type: 'Lauréat.Puissance.UseCase.RejeterDemandeChangement',
      data: {
        identifiantProjetValue: identifiantProjet,
        rejetéParValue: utilisateur.identifiantUtilisateur.formatter(),
        rejetéLeValue: new Date().toISOString(),
        réponseSignéeValue: reponseSignee,
        estUneDécisionDEtatValue: estUneDecisionDEtat === 'true',
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Puissance.changement.détailsPourRedirection(identifiantProjet),
        message: 'Le changement de puissance a bien été rejeté',
      },
    };
  });

export const rejeterChangementPuissanceAction = formAction(action, schema);
