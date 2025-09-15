'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  reponseSignee: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
  dateDemande: zod.string().min(1),
  estUneDecisionDEtat: zod.literal('true').optional(),
});

export type RejeterChangementPuissanceFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, reponseSignee, estUneDecisionDEtat, dateDemande },
) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Puissance.RejeterChangementPuissanceUseCase>({
      type: 'Lauréat.Puissance.UseCase.RejeterDemandeChangement',
      data: {
        identifiantProjetValue: identifiantProjet,
        rejetéParValue: utilisateur.identifiantUtilisateur.formatter(),
        rejetéLeValue: new Date().toISOString(),
        réponseSignéeValue: reponseSignee,
        rôleUtilisateurValue: utilisateur.role.nom,
        estUneDécisionDEtatValue: estUneDecisionDEtat === 'true',
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Puissance.changement.détails(identifiantProjet, dateDemande),
        message: 'Le changement de puissance a bien été rejeté',
      },
    };
  });
};

export const rejeterChangementPuissanceAction = formAction(action, schema);
