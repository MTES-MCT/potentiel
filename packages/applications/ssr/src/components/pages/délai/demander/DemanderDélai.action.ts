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
  dateAchevementPrevisionnelleActuelle: zod.string().min(1),
  nombreDeMois: zod.coerce.number().min(1, { message: 'Champ obligatoire' }),
  raison: zod.string().min(1, { message: 'Champ obligatoire' }),
  pieceJustificative: singleDocument({ acceptedFileTypes: ['application/pdf'] }),
});

export type DemanderDélaiFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, pieceJustificative, nombreDeMois, raison },
) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Délai.DemanderDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.DemanderDélai',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateDemandeValue: DateTime.now().formatter(),
        pièceJustificativeValue: pieceJustificative,
        raisonValue: raison,
        nombreDeMoisValue: nombreDeMois,
      },
    });

    return {
      status: 'success',
      redirection: { url: Routes.Délai.demander(identifiantProjet) },
    };
  });
};

export const demanderDélaiAction = formAction(action, schema);
