'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { puissanceProductionAnnuelleSchema } from '@/utils/candidature/candidatureFields.schema';
import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

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
    await mediator.send<Lauréat.Puissance.PuissanceUseCase>({
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
