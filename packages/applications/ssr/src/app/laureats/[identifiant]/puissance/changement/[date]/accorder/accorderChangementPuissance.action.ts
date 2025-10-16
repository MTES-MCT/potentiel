'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.union([
  zod.object({
    identifiantProjet: zod.string().min(1),
    reponseSignee: singleDocument({
      acceptedFileTypes: ['application/pdf'],
      optional: true,
    }),
    estUneDecisionDEtat: zod.literal('true'),
    dateDemande: zod.string().min(1),
  }),
  zod.object({
    identifiantProjet: zod.string().min(1),
    reponseSignee: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
    estUneDecisionDEtat: zod.literal('false'),
    dateDemande: zod.string().min(1),
  }),
]);

export type AccorderChangementPuissanceFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, reponseSignee, estUneDecisionDEtat, dateDemande },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Puissance.AccorderChangementPuissanceUseCase>({
      type: 'Lauréat.Puissance.UseCase.AccorderDemandeChangement',
      data: {
        identifiantProjetValue: identifiantProjet,
        accordéParValue: utilisateur.identifiantUtilisateur.formatter(),
        accordéLeValue: DateTime.now().formatter(),
        ...(estUneDecisionDEtat === 'true'
          ? {
              estUneDécisionDEtatValue: true,
              réponseSignéeValue: reponseSignee,
            }
          : {
              estUneDécisionDEtatValue: false,
              réponseSignéeValue: reponseSignee,
            }),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Puissance.changement.détails(identifiantProjet, dateDemande),
        message: 'Le changement de puissance a été pris en compte',
      },
    };
  });

export const accorderChangementPuissanceAction = formAction(action, schema);
