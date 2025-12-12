'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import { getContext } from '@potentiel-applications/request-context';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  reponseSignee: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
});

export type AccorderChangementActionnaireFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, reponseSignee },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Actionnaire.AccorderChangementActionnaireUseCase>({
      type: 'Lauréat.Actionnaire.UseCase.AccorderDemandeChangement',
      data: {
        identifiantProjetValue: identifiantProjet,
        accordéParValue: utilisateur.identifiantUtilisateur.formatter(),
        accordéLeValue: DateTime.now().formatter(),
        réponseSignéeValue: reponseSignee,
      },
    });

    const { url } = getContext() ?? {};

    return {
      status: 'success',
      redirection: {
        url: url ?? Routes.Lauréat.détails(identifiantProjet),
        message: "Le changement d'actionnaire(s) a bien été accordé",
      },
    };
  });

export const accorderChangementActionnaireAction = formAction(action, schema);
