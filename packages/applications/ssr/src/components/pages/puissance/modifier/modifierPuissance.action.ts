'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Puissance } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { puissanceProductionAnnuelleSchema } from '@/utils/zod/candidature/candidatureFields.schema';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  puissance: puissanceProductionAnnuelleSchema,
  raison: zod.string().optional(),
});

export type ModifierPuissanceFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, puissance, raison },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Puissance.PuissanceUseCase>({
      type: 'Lauréat.Puissance.UseCase.ModifierPuissance',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateModificationValue: new Date().toISOString(),
        raisonValue: raison,
        puissanceValue: puissance,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Projet.details(identifiantProjet),
        message: 'Le changement de puissance a été pris en compte',
      },
    };
  });

export const modifierPuissanceAction = formAction(action, schema);
