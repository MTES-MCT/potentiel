'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { booleanSchema } from '@/utils/candidature';
import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  accordInitiation: booleanSchema.optional().default(false),
});

export type InitierAchèvementFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, { identifiantProjet }) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Achèvement.InitierAchèvementUseCase>({
      type: 'Lauréat.Achèvement.UseCase.InitierAchèvement',
      data: {
        identifiantProjetValue: identifiantProjet,
        initiéLeValue: new Date().toISOString(),
        initiéParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Lauréat.détails.tableauDeBord(identifiantProjet),
        message: "L'achèvement du projet a bien été initié",
      },
    };
  });

export const initierAchèvementAction = formAction(action, schema);
