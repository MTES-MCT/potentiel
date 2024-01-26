'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';
import { FormAction, FormState, formAction } from '@/utils/formAction';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

export type AjouterGestionnaireRéseauState = FormState;

const schema = zod.object({
  identifiantGestionnaireReseau: zod.string().min(1),
  raisonSociale: zod.string().min(1),
  expressionReguliere: zod.string().optional(),
  format: zod.string().optional(),
  legende: zod.string().optional(),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantGestionnaireReseau, raisonSociale, expressionReguliere, format, legende },
) => {
  await mediator.send<GestionnaireRéseau.GestionnaireRéseauUseCase>({
    type: 'AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE',
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

  return previousState;
};

export const ajouterGestionnaireRéseauAction = formAction(action, schema);
