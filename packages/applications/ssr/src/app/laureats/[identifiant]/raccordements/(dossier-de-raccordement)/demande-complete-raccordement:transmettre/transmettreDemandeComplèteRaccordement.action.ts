'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { singleDocument } from '@/utils/zod/document/singleDocument';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  dateQualification: zod.string().min(1),
  identifiantGestionnaireReseau: zod.string().optional(),
  referenceDossier: zod.string().min(1),
  accuseReception: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
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
) =>
  withUtilisateur(async (utilisateur) => {
    if (identifiantGestionnaireReseau) {
      await mediator.send<Lauréat.Raccordement.RaccordementUseCase>({
        type: 'Lauréat.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet,
          identifiantGestionnaireRéseauValue: identifiantGestionnaireReseau,
          rôleValue: utilisateur.rôle.nom,
        },
      });
    }

    await mediator.send<Lauréat.Raccordement.RaccordementUseCase>({
      type: 'Lauréat.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet,
        dateQualificationValue: new Date(dateQualification).toISOString(),
        référenceDossierValue: referenceDossier,
        accuséRéceptionValue: accuseReception,
        transmiseParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.Raccordement.détail(identifiantProjet) },
    };
  });

export const transmettreDemandeComplèteRaccordementAction = formAction(action, schema);
