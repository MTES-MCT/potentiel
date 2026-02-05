'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { toUndefinedIfEmpty } from '@/utils/zod/stringTransform';

const schema = zod.object({
  identifiantGestionnaireReseau: zod
    .string()
    .min(1, { message: 'Code EIC ou gestionnaire réseau à préciser' }),
  raisonSociale: zod.string().min(1),
  expressionReguliere: zod.string().transform(toUndefinedIfEmpty).optional(),
  format: zod.string().transform(toUndefinedIfEmpty).optional(),
  legende: zod.string().transform(toUndefinedIfEmpty).optional(),
});

export type AjouterGestionnaireRéseauFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantGestionnaireReseau, raisonSociale, expressionReguliere, format, legende },
) => {
  await mediator.send<GestionnaireRéseau.AjouterGestionnaireRéseauUseCase>({
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
    redirection: {
      url: Routes.Gestionnaire.lister,
      message: `Le gestionnaire réseau ${raisonSociale} a été ajouté`,
    },
  };
};

export const ajouterGestionnaireRéseauAction = formAction(action, schema);
