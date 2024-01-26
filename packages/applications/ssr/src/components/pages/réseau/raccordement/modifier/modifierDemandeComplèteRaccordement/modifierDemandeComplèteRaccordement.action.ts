'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';

import { FormAction, FormState, formAction } from '@/utils/formAction';

export type ModifierDemandeComplèteRaccordementState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string(),
  identifiantGestionnaireRéseau: zod.string(),
  dateQualification: zod.string(),
  référenceDossierRaccordement: zod.string(),
  accuséRéception: zod.instanceof(Blob),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  {
    identifiantProjet,
    identifiantGestionnaireRéseau,
    accuséRéception,
    dateQualification,
    référenceDossierRaccordement,
  },
) => {
  await mediator.send<Raccordement.RaccordementUseCase>({
    type: 'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
    data: {
      identifiantProjetValue: identifiantProjet,
      identifiantGestionnaireRéseauValue: identifiantGestionnaireRéseau,
      accuséRéceptionValue: {
        content: accuséRéception.stream(),
        format: accuséRéception.type,
      },
      dateQualificationValue: dateQualification,
      référenceDossierRaccordementValue: référenceDossierRaccordement,
    },
  });

  return previousState;
};

export const modifierDemandeComplèteRaccordementAction = formAction(action, schema);
