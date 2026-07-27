'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import type { Éliminé } from '@potentiel-domain/projet';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  dateRéponseSignée: zod.string().min(1),
  reponseSignee: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
});

export type AccorderRecoursFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, reponseSignee, dateRéponseSignée },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Éliminé.Recours.AccorderRecoursUseCase>({
      type: 'Éliminé.Recours.UseCase.AccorderRecours',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateRéponseSignéeValue: new Date(dateRéponseSignée).toISOString(),
        accordéLeValue: new Date().toISOString(),
        réponseSignéeValue: reponseSignee,
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.Recours.détailPourRedirection(identifiantProjet) },
    };
  });

export const accorderRecoursAction = formAction(action, schema);
