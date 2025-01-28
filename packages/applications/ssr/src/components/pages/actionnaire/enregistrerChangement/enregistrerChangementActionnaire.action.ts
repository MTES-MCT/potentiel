'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Actionnaire } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { manyDocuments } from '@/utils/zod/document/manyDocuments';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  actionnaire: zod.string().min(1, { message: 'Champ obligatoire' }),
  raison: zod.string().min(1, { message: 'Champ obligatoire' }),
  piecesJustificatives: manyDocuments({ acceptedFileTypes: ['application/pdf'] }),
});

export type ModifierActionnaireFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, actionnaire, raison, piecesJustificatives },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Actionnaire.ActionnaireUseCase>({
      type: 'Lauréat.Actionnaire.UseCase.EnregistrerChangement',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        raisonValue: raison,
        actionnaireValue: actionnaire,
        dateChangementValue: new Date().toISOString(),
        pièceJustificativeValue: piecesJustificatives,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Projet.details(identifiantProjet),
        message: "Le changement d'actionnaire(s) a été pris en compte",
      },
    };
  });

export const enregistrerChangementActionnaireAction = formAction(action, schema);
