'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  raison: zod.string().min(1),
  pieceJustificative: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
  estPPA: zod.stringbool().optional(),
});

export type DemanderAbandonFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _previousState,
  { identifiantProjet, raison, pieceJustificative, estPPA },
) => {
  return withUtilisateur(async (utilisateur) => {
    const dateDemande = new Date().toISOString();
    await mediator.send<Lauréat.Abandon.DemanderAbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.DemanderAbandon',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateDemandeValue: dateDemande,
        raisonValue: raison,
        pièceJustificativeValue: pieceJustificative,
        ...(estPPA === true && { ppaSignaléValue: true }),
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.Abandon.détail(identifiantProjet, dateDemande) },
    };
  });
};

export const demanderAbandonAction = formAction(action, schema);
