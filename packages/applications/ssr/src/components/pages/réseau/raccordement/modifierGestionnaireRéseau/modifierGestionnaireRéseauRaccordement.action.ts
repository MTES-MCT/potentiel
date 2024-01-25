'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';

import { FormAction, FormState, formAction } from '@/utils/formAction';

export type ModifierGestionnaireRéseauRaccordementState = FormState;

const schema = zod.object({
  identifiantProjetValue: zod.string(),
  identifiantGestionnaireRéseauValue: zod.string(),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjetValue, identifiantGestionnaireRéseauValue },
) => {
  await mediator.send<Raccordement.ModifierGestionnaireRéseauRaccordementUseCase>({
    type: 'MODIFIER_GESTIONNAIRE_RÉSEAU_RACCORDEMENT_USE_CASE',
    data: {
      identifiantProjetValue,
      identifiantGestionnaireRéseauValue,
    },
  });

  return previousState;
};

export const modifierGestionnaireRéseauRaccordementAction = formAction(action, schema);
