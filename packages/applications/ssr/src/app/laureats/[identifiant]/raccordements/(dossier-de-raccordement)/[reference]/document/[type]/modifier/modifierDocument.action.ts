'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  documentSelectionSchema,
  keepOrUpdateSingleDocument,
} from '@/utils/zod/document/keepOrUpdateDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossierRaccordement: zod.string().min(1),
  dateSignature: zod.string().min(1),
  documentSigné: keepOrUpdateSingleDocument({
    acceptedFileTypes: ['application/pdf'],
  }),
  type: zod.enum(Lauréat.Raccordement.TypeDocumentsRaccordement.type, {
    message: `Le type de document n'est pas valide`,
  }),
  documentSignéDocumentSelection: documentSelectionSchema,
});

export type ModifierDocumentFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  {
    identifiantProjet,
    referenceDossierRaccordement,
    documentSigné,
    documentSignéDocumentSelection,
    dateSignature,
    type,
  },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Raccordement.ModifierDocumentUseCase>({
      type: 'Lauréat.Raccordement.UseCase.ModifierDocument',
      data: {
        identifiantProjetValue: identifiantProjet,
        référenceDossierRaccordementValue: referenceDossierRaccordement,
        dateSignatureValue: new Date(dateSignature).toISOString(),
        typeValue: type,
        documentRaccordementValue: documentSigné,
        estUnNouveauDocumentValue: documentSignéDocumentSelection === 'edit_document',
        rôleValue: utilisateur.rôle.nom,
        modifiéLeValue: DateTime.now().formatter(),
        modifiéParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.Raccordement.détail(identifiantProjet) },
    };
  });

export const modifierDocumentAction = formAction(action, schema);
