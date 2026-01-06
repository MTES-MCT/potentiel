'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { getContext } from '@potentiel-applications/request-context';

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
  }),
  zod.object({
    identifiantProjet: zod.string().min(1),
    reponseSignee: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
    estUneDecisionDEtat: zod.literal('false'),
  }),
]);

export type AccorderChangementPuissanceFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, reponseSignee, estUneDecisionDEtat },
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

    const { url } = getContext() ?? {};

    return {
      status: 'success',
      redirection: {
        url: url ?? Routes.Lauréat.détails.informationGénérales(identifiantProjet),
        message: 'Le changement de puissance bien été accordé',
      },
    };
  });

export const accorderChangementPuissanceAction = formAction(action, schema);
