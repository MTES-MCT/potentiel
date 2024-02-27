'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { FormAction, formAction, FormState } from '@/utils/formAction';

export type ModifierGestionnaireRéseauState = FormState;

const schema = zod.object({
  identifiantGestionnaireReseau: zod.string().min(1),
  raisonSociale: zod.string().min(1),
  expressionReguliere: zod.string().optional(),
  format: zod.string().optional(),
  legende: zod.string().optional(),
});

const action: FormAction<ModifierGestionnaireRéseauState, typeof schema> = async (
  _,
  { identifiantGestionnaireReseau, raisonSociale, expressionReguliere, format, legende },
) => {
  await mediator.send<GestionnaireRéseau.GestionnaireRéseauUseCase>({
    type: 'Réseau.Gestionnaire.UseCase.ModifierGestionnaireRéseau',
    data: {
      aideSaisieRéférenceDossierRaccordementValue: {
        expressionReguliereValue: expressionReguliere || '',
        formatValue: format || '',
        légendeValue: legende || '',
      },
      identifiantGestionnaireRéseauValue: identifiantGestionnaireReseau,
      raisonSocialeValue: raisonSociale,
    },
  });

  return {
    status: 'success',
  };
};

export const modifierGestionnaireRéseauAction = formAction(action, schema);
