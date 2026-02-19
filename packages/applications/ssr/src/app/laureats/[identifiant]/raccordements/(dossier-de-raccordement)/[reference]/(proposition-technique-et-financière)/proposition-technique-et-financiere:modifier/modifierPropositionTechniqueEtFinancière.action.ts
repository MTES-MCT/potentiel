'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import {
  documentSelectionSchema,
  keepOrUpdateSingleDocument,
} from '@/utils/zod/document/keepOrUpdateDocument';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossierRaccordement: zod.string().min(1),
  dateSignature: zod.string().min(1),
  propositionTechniqueEtFinanciereSignee: keepOrUpdateSingleDocument({
    acceptedFileTypes: ['application/pdf'],
  }),
  propositionTechniqueEtFinanciereSigneeDocumentSelection: documentSelectionSchema,
});

export type ModifierPropositionTechniqueEtFinancièreFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  {
    identifiantProjet,
    referenceDossierRaccordement,
    propositionTechniqueEtFinanciereSignee,
    propositionTechniqueEtFinanciereSigneeDocumentSelection,
    dateSignature,
  },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Raccordement.ModifierPropositionTechniqueEtFinancièreUseCase>({
      type: 'Lauréat.Raccordement.UseCase.ModifierPropositionTechniqueEtFinancière',
      data: {
        identifiantProjetValue: identifiantProjet,
        référenceDossierRaccordementValue: referenceDossierRaccordement,
        dateSignatureValue: new Date(dateSignature).toISOString(),
        propositionTechniqueEtFinancièreSignéeValue:
          propositionTechniqueEtFinanciereSigneeDocumentSelection === 'edit_document'
            ? propositionTechniqueEtFinanciereSignee
            : undefined,
        rôleValue: utilisateur.rôle.nom,
        modifiéeLeValue: DateTime.now().formatter(),
        modifiéeParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.Raccordement.détail(identifiantProjet) },
    };
  });

export const modifierPropositionTechniqueEtFinancièreAction = formAction(action, schema);
