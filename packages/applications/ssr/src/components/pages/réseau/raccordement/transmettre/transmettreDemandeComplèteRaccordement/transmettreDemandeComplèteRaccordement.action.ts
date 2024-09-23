'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { validateDocumentSize } from '@/utils/zod/documentError';

export type TransmettreDemandeComplèteRaccordementState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  dateQualification: zod.string().min(1),
  identifiantGestionnaireReseau: zod.string().min(1),
  referenceDossier: zod.string().min(1),
  accuseReception: zod.instanceof(Blob).superRefine((file, ctx) => validateDocumentSize(file, ctx)),
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
      référenceDossierValue: referenceDossier,
      accuséRéceptionValue: {
        content: accuseReception.stream(),
        format: accuseReception.type,
      },
    },
  });

  return {
    status: 'success',
    redirectUrl: Routes.Raccordement.détail(identifiantProjet),
  };
};

export const transmettreDemandeComplèteRaccordementAction = formAction(action, schema);
