'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  dateQualification: zod.string().min(1, { message: 'Champ obligatoire' }),
  identifiantGestionnaireReseau: zod.string().min(1),
  referenceDossier: zod.string().min(1, { message: 'Champ obligatoire' }),
  accuseReception: singleDocument(),
});

export type TransmettreDemandeComplèteRaccordementFormKeys = keyof zod.infer<typeof schema>;

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
      accuséRéceptionValue: accuseReception,
    },
  });

  return {
    status: 'success',
    redirection: { url: Routes.Raccordement.détail(identifiantProjet) },
  };
};

export const transmettreDemandeComplèteRaccordementAction = formAction(action, schema);
