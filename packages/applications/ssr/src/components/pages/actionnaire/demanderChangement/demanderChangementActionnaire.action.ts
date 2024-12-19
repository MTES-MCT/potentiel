'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Actionnaire } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  actionnaire: zod.string().min(1, { message: 'Champ obligatoire' }),
});

export type DemanderChangementActionnaireFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, actionnaire },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Actionnaire.ActionnaireUseCase>({
      type: 'Lauréat.Actionnaire.UseCase.DemanderChangement',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateDemandeValue: new Date().toISOString(),
        // doc
        actionnaireValue: actionnaire,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Projet.details(identifiantProjet),
        message: "La demande de changement d'actionnaire a bien été enregistrée",
      },
    };
  });

export const demanderChangementActionnaireAction = formAction(action, schema);
