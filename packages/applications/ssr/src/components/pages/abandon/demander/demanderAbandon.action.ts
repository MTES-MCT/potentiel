'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Abandon } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const abandonWithRecandidatureSchema = zod.object({
  identifiantProjet: zod.string().min(1),
  recandidature: zod.literal('true'),
  raison: zod.string().min(1, { message: 'Champ obligatoire' }),
  pieceJustificative: singleDocument({ optional: true, acceptedFileTypes: ['application/pdf'] }),
});

const abandonWithoutRecandidatureSchema = zod.object({
  identifiantProjet: zod.string().min(1),
  recandidature: zod.literal('false').optional(),
  raison: zod.string().min(1, { message: 'Champ obligatoire' }),
  pieceJustificative: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
});

const schema = zod.union([abandonWithRecandidatureSchema, abandonWithoutRecandidatureSchema]);

export type DemanderAbandonFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, raison, recandidature, pieceJustificative },
) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<Abandon.AbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.DemanderAbandon',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateDemandeValue: new Date().toISOString(),
        raisonValue: raison,
        recandidatureValue: recandidature === 'true',
        ...(pieceJustificative && {
          pièceJustificativeValue: pieceJustificative,
        }),
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.Abandon.détail(identifiantProjet) },
    };
  });
};

export const demanderAbandonAction = formAction(action, schema);
