'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';

import { FormAction, FormState, formAction } from '@/utils/formAction';

export type ModifierGestionnaireRéseauRaccordementState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string(),
  identifiantGestionnaireReseau: zod.string(),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, identifiantGestionnaireReseau },
) => {
  await mediator.send<Raccordement.RaccordementUseCase>({
    type: 'MODIFIER_GESTIONNAIRE_RÉSEAU_RACCORDEMENT_USE_CASE',
    data: {
      identifiantProjetValue: identifiantProjet,
      identifiantGestionnaireRéseauValue: identifiantGestionnaireReseau,
    },
  });

  return previousState;
};

export const modifierGestionnaireRéseauRaccordementAction = formAction(action, schema);
