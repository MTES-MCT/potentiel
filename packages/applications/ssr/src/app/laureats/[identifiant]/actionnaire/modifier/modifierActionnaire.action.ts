'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { manyDocuments } from '@/utils/zod/document/manyDocuments';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  actionnaire: zod.string().min(1),
  raison: zod.string().optional(),
  piecesJustificatives: manyDocuments({ optional: true, acceptedFileTypes: ['application/pdf'] }),
});

export type ModifierActionnaireFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, actionnaire, raison, piecesJustificatives },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Actionnaire.ActionnaireUseCase>({
      type: 'Lauréat.Actionnaire.UseCase.ModifierActionnaire',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateModificationValue: new Date().toISOString(),
        raisonValue: raison ?? '',
        actionnaireValue: actionnaire,
        ...(piecesJustificatives && {
          pièceJustificativeValue: piecesJustificatives,
        }),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Lauréat.détails.informationGénérales(identifiantProjet),
        message: "Le changement d'actionnaire(s) a été pris en compte",
      },
    };
  });

export const modifierActionnaireAction = formAction(action, schema);
