'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  nomProjet: zod.string().min(1),
  raison: zod.string().min(1),
  piecesJustificatives: singleDocument({ acceptedFileTypes: ['application/pdf'], optional: true }),
});
export type ModifierNomProjetFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, nomProjet, piecesJustificatives, raison },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.ModifierNomProjetUseCase>({
      type: 'Lauréat.UseCase.ModifierNomProjet',
      data: {
        identifiantProjetValue: identifiantProjet,
        nomProjetValue: nomProjet,
        modifiéParValue: utilisateur.identifiantUtilisateur.formatter(),
        modifiéLeValue: DateTime.now().formatter(),
        pièceJustificativeValue: piecesJustificatives,
        raisonValue: raison,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Lauréat.détails.tableauDeBord(identifiantProjet),
        message: 'Le nom du projet a été modifié',
      },
    };
  });

export const modifierNomProjetAction = formAction(action, schema);
