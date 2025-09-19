'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  nombreDeMois: zod.coerce.number().min(1),
  raison: zod.string().min(1),
  pieceJustificative: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
});

export type DemanderDélaiFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, pieceJustificative, nombreDeMois, raison },
) => {
  return withUtilisateur(async (utilisateur) => {
    const dateDemandeValue = DateTime.now().formatter();

    await mediator.send<Lauréat.Délai.DemanderDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.DemanderDélai',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateDemandeValue,
        pièceJustificativeValue: pieceJustificative,
        raisonValue: raison,
        nombreDeMoisValue: nombreDeMois,
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.Délai.détail(identifiantProjet, dateDemandeValue) },
    };
  });
};

export const demanderDélaiAction = formAction(action, schema);
