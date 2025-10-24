'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  optionalPuissanceOuPuissanceDeSiteSchema,
  puissanceOuPuissanceDeSiteSchema,
} from '@/utils/candidature/candidatureFields.schema';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  puissance: puissanceOuPuissanceDeSiteSchema,
  puissanceDeSite: optionalPuissanceOuPuissanceDeSiteSchema,
  raison: zod.string().optional(),
});

export type ModifierPuissanceFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, puissance, raison, puissanceDeSite },
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
        puissanceDeSiteValue: puissanceDeSite,
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
