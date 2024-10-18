'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  identifiantGestionnaireReseau: zod.string().min(1, { message: 'Champ obligatoire' }),
});

export type AttribuerGestionnaireRéseauRaccordementFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, identifiantGestionnaireReseau },
) => {
  await mediator.send<Raccordement.AttribuerGestionnaireRéseauUseCase>({
    type: 'Réseau.Raccordement.UseCase.AttribuerGestionnaireRéseau',
    data: {
      identifiantProjetValue: identifiantProjet,
      identifiantGestionnaireRéseauValue: identifiantGestionnaireReseau,
    },
  });

  return {
    status: 'success',
    redirectUrl: Routes.Raccordement.transmettreDemandeComplèteRaccordement(identifiantProjet),
  };
};

export const attribuerGestionnaireRéseauRaccordementAction = formAction(action, schema);
