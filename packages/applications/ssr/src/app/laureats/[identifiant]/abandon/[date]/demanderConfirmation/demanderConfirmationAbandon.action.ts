'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  reponseSignee: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
  dateDemande: zod.string().min(1),
});

export type DemanderConfirmationAbandonFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, reponseSignee, dateDemande },
) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Abandon.AbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.DemanderConfirmationAbandon',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        rôleUtilisateurValue: utilisateur.rôle.nom,
        dateDemandeValue: new Date().toISOString(),
        réponseSignéeValue: reponseSignee,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Abandon.détail(identifiantProjet, dateDemande),
      },
    };
  });
};

export const demanderConfirmationAbandonAction = formAction(action, schema);
