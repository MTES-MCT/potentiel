'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

export type ModifierDemandeComplèteRaccordementState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string(),
  identifiantGestionnaireReseau: zod.string(),
  dateQualification: zod.string(),
  referenceDossierRaccordement: zod.string(),
  referenceDossierRaccordementActuelle: zod.string(),
  accuseReception: zod.instanceof(Blob).refine((data) => data.size > 0),
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
    await mediator.send<Raccordement.RaccordementUseCase>({
      type: 'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantGestionnaireRéseauValue: identifiantGestionnaireReseau,
        accuséRéceptionValue: {
          content: accuseReception.stream(),
          format: accuseReception.type,
        },
        dateQualificationValue: new Date(dateQualification).toISOString(),
        référenceDossierRaccordementValue: referenceDossierRaccordementActuelle,
      },
    });

    if (referenceDossierRaccordement !== referenceDossierRaccordementActuelle) {
      await mediator.send<Raccordement.ModifierRéférenceDossierRaccordementUseCase>({
        type: 'MODIFIER_RÉFÉRENCE_DOSSIER_RACCORDEMENT_USE_CASE',
        data: {
          identifiantGestionnaireRéseauValue: identifiantGestionnaireReseau,
          identifiantProjetValue: identifiantProjet,
          référenceDossierRaccordementActuelleValue: referenceDossierRaccordementActuelle,
          nouvelleRéférenceDossierRaccordementValue: referenceDossierRaccordement,
          rôleValue: utilisateur.role.nom,
        },
      });
    }

    return {
      status: 'success',
    };
  });

export const modifierDemandeComplèteRaccordementAction = formAction(action, schema);
