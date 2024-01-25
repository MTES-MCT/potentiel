'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';

import { FormAction, FormState, formAction } from '@/utils/formAction';

export type TransmettreDemandeComplèteRaccordementState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string(),
  dateQualification: zod.string(),
  identifiantGestionnaireReseau: zod.string(),
  referenceDossier: zod.string(),
  accuseReception: zod.instanceof(Blob),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  {
    identifiantProjet,
    dateQualification,
    identifiantGestionnaireReseau,
    referenceDossier,
    accuseReception,
  },
) => {
  await mediator.send<Raccordement.TransmettreDemandeComplèteRaccordementUseCase>({
    type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
    data: {
      identifiantProjetValue: identifiantProjet,
      dateQualificationValue: dateQualification,
      identifiantGestionnaireRéseauValue: identifiantGestionnaireReseau,
      référenceDossierValue: referenceDossier,
      accuséRéceptionValue: {
        content: accuseReception.stream(),
        format: accuseReception.type,
      },
    },
  });

  return previousState;
};

export const transmettreDemandeComplèteRaccordementAction = formAction(action, schema);
