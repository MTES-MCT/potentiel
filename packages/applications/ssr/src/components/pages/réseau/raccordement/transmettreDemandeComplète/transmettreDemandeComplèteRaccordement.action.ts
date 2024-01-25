'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';

import { FormAction, FormState, formAction } from '@/utils/formAction';

export type TransmettreDemandeComplèteRaccordementState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string(),
  dateQualification: zod.string(),
  identifiantGestionnaireRéseau: zod.string(),
  référenceDossier: zod.string(),
  accuséRéception: zod.instanceof(Blob),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  {
    identifiantProjet,
    dateQualification,
    identifiantGestionnaireRéseau,
    référenceDossier,
    accuséRéception,
  },
) => {
  await mediator.send<Raccordement.TransmettreDemandeComplèteRaccordementUseCase>({
    type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
    data: {
      identifiantProjetValue: identifiantProjet,
      dateQualificationValue: dateQualification,
      identifiantGestionnaireRéseauValue: identifiantGestionnaireRéseau,
      référenceDossierValue: référenceDossier,
      accuséRéceptionValue: {
        content: accuséRéception.stream(),
        format: accuséRéception.type,
      },
    },
  });

  return previousState;
};

export const transmettreDemandeComplèteRaccordementAction = formAction(action, schema);
