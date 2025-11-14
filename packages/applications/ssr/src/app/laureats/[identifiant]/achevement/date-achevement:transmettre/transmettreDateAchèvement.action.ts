'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  dateAchevement: zod.string().min(1),
});

export type TransmettreDateAchèvementFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, dateAchevement },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Achèvement.TransmettreDateAchèvementUseCase>({
      type: 'Lauréat.Achèvement.UseCase.TransmettreDateAchèvement',
      data: {
        identifiantProjetValue: identifiantProjet,
        dateAchèvementValue: new Date(dateAchevement).toISOString(),
        transmiseParValue: utilisateur.identifiantUtilisateur.formatter(),
        transmiseLeValue: new Date().toISOString(),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Projet.details(identifiantProjet),
      },
    };
  });

export const transmettreDateAchèvementAction = formAction(action, schema);
