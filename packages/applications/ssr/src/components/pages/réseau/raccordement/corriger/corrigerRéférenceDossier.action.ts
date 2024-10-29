'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import type { Raccordement } from '@potentiel-domain/reseau';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

export type CorrigerRéférenceDossierFormKeys = keyof zod.infer<typeof schema>;

const schema = zod
  .object({
    identifiantProjet: zod.string().min(1),
    referenceDossier: zod.string().min(1),
    referenceDossierCorrigee: zod.string().min(1),
  })
  .refine(
    ({ referenceDossier, referenceDossierCorrigee }) =>
      referenceDossier !== referenceDossierCorrigee,
    {
      path: ['referenceDossierCorrigee'],
      message: "La nouvelle référence de dossier doit être différente de l'ancienne",
    },
  );

const action: FormAction<FormState, typeof schema> = (
  _,
  { identifiantProjet, referenceDossier, referenceDossierCorrigee },
) =>
  withUtilisateur(async ({ role }) => {
    await mediator.send<Raccordement.ModifierRéférenceDossierRaccordementUseCase>({
      type: 'Réseau.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet,
        nouvelleRéférenceDossierRaccordementValue: referenceDossierCorrigee,
        référenceDossierRaccordementActuelleValue: referenceDossier,
        rôleValue: role.nom,
      },
    });

    return {
      status: 'success',
      redirectUrl: Routes.Raccordement.détail(identifiantProjet),
    };
  });

export const corrigerRéférenceDossierAction = formAction(action, schema);
