'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  dateDemande: zod.string().min(1),
  reponseSignee: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
});

export type RejeterChangementActionnaireFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, dateDemande, reponseSignee },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Actionnaire.ActionnaireUseCase>({
      type: 'Lauréat.Actionnaire.UseCase.RejeterDemandeChangement',
      data: {
        identifiantProjetValue: identifiantProjet,
        rejetéParValue: utilisateur.identifiantUtilisateur.formatter(),
        rejetéLeValue: new Date().toISOString(),
        réponseSignéeValue: reponseSignee,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Actionnaire.changement.détails(identifiantProjet, dateDemande),
      },
    };
  });

export const rejeterChangementActionnaireAction = formAction(action, schema);
