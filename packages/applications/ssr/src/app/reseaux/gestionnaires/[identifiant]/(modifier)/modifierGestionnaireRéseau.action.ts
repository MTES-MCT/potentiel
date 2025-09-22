'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { toUndefinedIfEmpty } from '@/utils/zod/stringTransform';

const schema = zod.object({
  identifiantGestionnaireReseau: zod.string().min(1),
  raisonSociale: zod.string().min(1),
  expressionReguliere: zod.string().transform(toUndefinedIfEmpty).optional(),
  format: zod.string().transform(toUndefinedIfEmpty).optional(),
  legende: zod.string().transform(toUndefinedIfEmpty).optional(),
  contactEmail: zod.string().transform(toUndefinedIfEmpty).optional(),
});

export type ModifierGestionnaireRéseauFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  {
    identifiantGestionnaireReseau,
    raisonSociale,
    expressionReguliere,
    format,
    legende,
    contactEmail,
  },
) => {
  await mediator.send<GestionnaireRéseau.GestionnaireRéseauUseCase>({
    type: 'Réseau.Gestionnaire.UseCase.ModifierGestionnaireRéseau',
    data: {
      aideSaisieRéférenceDossierRaccordementValue: {
        expressionReguliereValue: expressionReguliere,
        formatValue: format,
        légendeValue: legende,
      },
      identifiantGestionnaireRéseauValue: identifiantGestionnaireReseau,
      raisonSocialeValue: raisonSociale,
      contactEmailValue: contactEmail,
    },
  });

  return {
    status: 'success',
    redirection: {
      url: Routes.Gestionnaire.lister,
      message: `Le gestionnaire de réseau ${raisonSociale} a été modifié avec succès`,
    },
  };
};

export const modifierGestionnaireRéseauAction = formAction(action, schema);
