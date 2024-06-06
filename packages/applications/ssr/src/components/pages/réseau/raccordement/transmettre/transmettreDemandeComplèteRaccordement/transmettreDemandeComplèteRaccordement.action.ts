'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Raccordement } from '@potentiel-domain/reseau';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { removeSpacesAndTabulations } from '@/utils/removeSpacesAndTabulations';

export type TransmettreDemandeComplèteRaccordementState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  dateQualification: zod.string().min(1),
  identifiantGestionnaireReseau: zod.string().min(1),
  referenceDossier: zod.string().min(1),
  accuseReception: zod.instanceof(Blob).refine((data) => data.size > 0),
});

const action: FormAction<FormState, typeof schema> = async (
  _,
  {
    identifiantProjet,
    dateQualification,
    identifiantGestionnaireReseau,
    referenceDossier,
    accuseReception,
  },
) => {
  await mediator.send<Raccordement.RaccordementUseCase>({
    type: 'Réseau.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement',
    data: {
      identifiantProjetValue: identifiantProjet,
      dateQualificationValue: new Date(dateQualification).toISOString(),
      identifiantGestionnaireRéseauValue: identifiantGestionnaireReseau,
      référenceDossierValue: removeSpacesAndTabulations(referenceDossier),
      accuséRéceptionValue: {
        content: accuseReception.stream(),
        format: accuseReception.type,
      },
    },
  });

  return {
    status: 'success',
  };
};

export const transmettreDemandeComplèteRaccordementAction = formAction(action, schema);
