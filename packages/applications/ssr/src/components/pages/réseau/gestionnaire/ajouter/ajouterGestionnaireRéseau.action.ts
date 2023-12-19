'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';
import { FormAction, FormState, formAction } from '@/utils/formAction';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

export type AjouterGestionnaireRéseauState = FormState;

const schema = zod.object({
  identifiantGestionnaireRéseau: zod.string(),
  raisonSociale: zod.string(),
  expressionReguliere: zod.string().optional(),
  format: zod.string().optional(),
  légende: zod.string().optional(),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantGestionnaireRéseau, raisonSociale, expressionReguliere, format, légende },
) => {
  await mediator.send<GestionnaireRéseau.AjouterGestionnaireRéseauUseCase>({
    type: 'AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE',
    data: {
      aideSaisieRéférenceDossierRaccordementValue: {
        expressionReguliereValue: expressionReguliere || '',
        formatValue: format || '',
        légendeValue: légende || '',
      },
      identifiantGestionnaireRéseauValue: identifiantGestionnaireRéseau,
      raisonSocialeValue: raisonSociale,
    },
  });

  return previousState;
};

export const demanderAbandonAction = formAction(action, schema);
