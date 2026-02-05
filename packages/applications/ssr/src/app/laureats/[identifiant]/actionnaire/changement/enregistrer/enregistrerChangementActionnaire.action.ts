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
  raison: zod.string().min(1),
  piecesJustificatives: manyDocuments({ acceptedFileTypes: ['application/pdf'] }),
});

export type ModifierActionnaireFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, actionnaire, raison, piecesJustificatives },
) =>
  withUtilisateur(async (utilisateur) => {
    const dateChangement = new Date().toISOString();

    await mediator.send<Lauréat.Actionnaire.EnregistrerChangementActionnaireUseCase>({
      type: 'Lauréat.Actionnaire.UseCase.EnregistrerChangement',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        raisonValue: raison,
        actionnaireValue: actionnaire,
        dateChangementValue: dateChangement,
        pièceJustificativeValue: piecesJustificatives,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Actionnaire.changement.détails(identifiantProjet, dateChangement),
        message: "Le changement d'actionnaire(s) a été pris en compte",
      },
    };
  });

export const enregistrerChangementActionnaireAction = formAction(action, schema);
