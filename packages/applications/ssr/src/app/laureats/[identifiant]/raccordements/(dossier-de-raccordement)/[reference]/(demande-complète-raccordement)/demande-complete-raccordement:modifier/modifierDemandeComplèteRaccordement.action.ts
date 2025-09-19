'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { keepOrUpdateSingleDocument } from '@/utils/zod/document/keepOrUpdateDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  dateQualification: zod.string(),
  referenceDossierRaccordement: zod.string().min(1),
  referenceDossierRaccordementActuelle: zod.string().min(1),
  accuseReception: keepOrUpdateSingleDocument({ acceptedFileTypes: ['application/pdf'] }),
});

export type ModifierDemandeComplèteRaccordementFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  {
    identifiantProjet,
    accuseReception,
    dateQualification,
    referenceDossierRaccordement,
    referenceDossierRaccordementActuelle,
  },
) =>
  withUtilisateur(async (utilisateur) => {
    if (referenceDossierRaccordement !== referenceDossierRaccordementActuelle) {
      await mediator.send<Lauréat.Raccordement.ModifierRéférenceDossierRaccordementUseCase>({
        type: 'Lauréat.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet,
          référenceDossierRaccordementActuelleValue: referenceDossierRaccordementActuelle,
          nouvelleRéférenceDossierRaccordementValue: referenceDossierRaccordement,
          rôleValue: utilisateur.role.nom,
          modifiéeLeValue: DateTime.now().formatter(),
          modifiéeParValue: utilisateur.identifiantUtilisateur.formatter(),
        },
      });
    }

    await mediator.send<Lauréat.Raccordement.RaccordementUseCase>({
      type: 'Lauréat.Raccordement.UseCase.ModifierDemandeComplèteRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet,
        accuséRéceptionValue: accuseReception,
        dateQualificationValue: new Date(dateQualification).toISOString(),
        référenceDossierRaccordementValue: referenceDossierRaccordement,
        rôleValue: utilisateur.role.nom,
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.Raccordement.détail(identifiantProjet) },
    };
  });

export const modifierDemandeComplèteRaccordementAction = formAction(action, schema);
