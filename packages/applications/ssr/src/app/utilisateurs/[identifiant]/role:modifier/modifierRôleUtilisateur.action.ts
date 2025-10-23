'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';
import { redirect } from 'next/navigation';

import { ModifierRôleUtilisateurUseCase } from '@potentiel-domain/utilisateur';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantUtilisateur: zod.string().min(1),
  nouveauRole: zod.string(),
  region: zod.string().optional(),
  identifiantGestionnaireReseau: zod.string().optional(),
  zone: zod.string().optional(),
  fonction: zod.string().optional(),
});

export type ModifierRôleUtilisateurFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantUtilisateur, nouveauRole, identifiantGestionnaireReseau, region, zone, fonction },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<ModifierRôleUtilisateurUseCase>({
      type: 'Utilisateur.UseCase.ModifierRôleUtilisateur',
      data: {
        identifiantUtilisateurValue: identifiantUtilisateur,
        nouveauRôleValue: nouveauRole,
        modifiéLeValue: DateTime.now().formatter(),
        modifiéParValue: utilisateur.identifiantUtilisateur.formatter(),

        régionValue: region,
        identifiantGestionnaireRéseauValue: identifiantGestionnaireReseau,
        zoneValue: zone,
        fonctionValue: fonction,
      },
    });

    redirect(Routes.Utilisateur.lister());
  });

export const modifierRôleUtilisateurAction = formAction(action, schema);
