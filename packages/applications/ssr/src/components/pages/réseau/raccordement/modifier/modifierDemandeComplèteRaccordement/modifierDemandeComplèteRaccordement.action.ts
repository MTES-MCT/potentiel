'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { document } from '@/utils/zod/documentTypes';

export type ModifierDemandeComplèteRaccordementState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  identifiantGestionnaireReseau: zod.string().min(1),
  dateQualification: zod.string().min(1),
  referenceDossierRaccordement: zod.string().min(1),
  referenceDossierRaccordementActuelle: zod.string().min(1),
  accuseReception: document,
});

const action: FormAction<FormState, typeof schema> = async (
  _,
  {
    identifiantProjet,
    identifiantGestionnaireReseau,
    accuseReception,
    dateQualification,
    referenceDossierRaccordement,
    referenceDossierRaccordementActuelle,
  },
) =>
  withUtilisateur(async (utilisateur) => {
    if (referenceDossierRaccordement !== referenceDossierRaccordementActuelle) {
      await mediator.send<Raccordement.ModifierRéférenceDossierRaccordementUseCase>({
        type: 'Réseau.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet,
          référenceDossierRaccordementActuelleValue: referenceDossierRaccordementActuelle,
          nouvelleRéférenceDossierRaccordementValue: referenceDossierRaccordement,
          rôleValue: utilisateur.role.nom,
        },
      });
    }

    await mediator.send<Raccordement.RaccordementUseCase>({
      type: 'Réseau.Raccordement.UseCase.ModifierDemandeComplèteRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantGestionnaireRéseauValue: identifiantGestionnaireReseau,
        accuséRéceptionValue: {
          content: accuseReception.stream(),
          format: accuseReception.type,
        },
        dateQualificationValue: new Date(dateQualification).toISOString(),
        référenceDossierRaccordementValue: referenceDossierRaccordement,
        rôleValue: utilisateur.role.nom,
      },
    });

    return {
      status: 'success',
      redirectUrl: Routes.Raccordement.détail(identifiantProjet),
    };
  });

export const modifierDemandeComplèteRaccordementAction = formAction(action, schema);
