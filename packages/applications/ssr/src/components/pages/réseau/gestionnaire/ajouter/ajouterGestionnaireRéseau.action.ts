'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { toUndefinedIfEmpty } from '@/utils/zod/stringTransform';

export type AjouterGestionnaireRéseauState = FormState;

const schema = zod.object({
  identifiantGestionnaireReseau: zod.string().min(1),
  raisonSociale: zod.string().min(1),
  expressionReguliere: zod.string().transform(toUndefinedIfEmpty).optional(),
  format: zod.string().transform(toUndefinedIfEmpty).optional(),
  legende: zod.string().transform(toUndefinedIfEmpty).optional(),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantGestionnaireReseau, raisonSociale, expressionReguliere, format, legende },
) => {
  await mediator.send<GestionnaireRéseau.GestionnaireRéseauUseCase>({
    type: 'Réseau.Gestionnaire.UseCase.AjouterGestionnaireRéseau',
    data: {
      aideSaisieRéférenceDossierRaccordementValue: {
        expressionReguliereValue: expressionReguliere,
        formatValue: format,
        légendeValue: legende,
      },
      identifiantGestionnaireRéseauValue: identifiantGestionnaireReseau,
      raisonSocialeValue: raisonSociale,
    },
  });

  return {
    status: 'success',
  };
};

export const ajouterGestionnaireRéseauAction = formAction(action, schema);
