'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossier: zod.string().min(1),
  type: zod.enum(Lauréat.Raccordement.TypeDocumentsRaccordement.type, {
    message: `Le type de document n'est pas valide`,
  }),
  dateSignature: zod.string().min(1),
  documentSigné: singleDocument({
    acceptedFileTypes: ['application/pdf'],
  }),
});

export type TransmettreDocumentFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, referenceDossier, dateSignature, documentSigné, type },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Raccordement.TransmettreDocumentUseCase>({
      type: 'Lauréat.Raccordement.UseCase.TransmettreDocument',
      data: {
        identifiantProjetValue: identifiantProjet,
        référenceDossierRaccordementValue: referenceDossier,
        dateSignatureValue: new Date(dateSignature).toISOString(),
        typeValue: type,
        documentRaccordementValue: documentSigné,
        transmisLeValue: new Date().toISOString(),
        transmisParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.Raccordement.détail(identifiantProjet) },
    };
  });

export const transmettreDocumentAction = formAction(action, schema);
