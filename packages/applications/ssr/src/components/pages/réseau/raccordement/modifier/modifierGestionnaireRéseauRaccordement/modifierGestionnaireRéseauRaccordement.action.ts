'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  identifiantGestionnaireReseau: zod.string().min(1, { message: 'Identifiant à préciser' }),
});

export type ModifierGestionnaireRéseauRaccordementFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, identifiantGestionnaireReseau },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Raccordement.RaccordementUseCase>({
      type: 'Réseau.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantGestionnaireRéseauValue: identifiantGestionnaireReseau,
        rôleValue: utilisateur.role.nom,
      },
    });

    return {
      status: 'success',
      redirectUrl: Routes.Raccordement.détail(identifiantProjet),
    };
  });

export const modifierGestionnaireRéseauRaccordementAction = formAction(action, schema);
