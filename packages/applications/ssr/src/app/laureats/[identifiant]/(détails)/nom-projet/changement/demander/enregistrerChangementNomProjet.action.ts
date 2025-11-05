'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { singleDocument } from '../../../../../../../utils/zod/document/singleDocument';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  nomProjet: zod.string().min(1),
  raison: zod.string().optional(),
  piecesJustificatives: singleDocument({ acceptedFileTypes: ['application/pdf'], optional: true }),
});

export type ModifierNomProjetFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, nomProjet, raison, piecesJustificatives },
) =>
  withUtilisateur(async (utilisateur) => {
    const dateChangement = new Date().toISOString();

    await mediator.send<Lauréat.EnregistrerChangementNomProjetUseCase>({
      type: 'Lauréat.UseCase.EnregistrerChangementNomProjet',
      data: {
        identifiantProjetValue: identifiantProjet,
        nomProjetValue: nomProjet,
        enregistréParValue: utilisateur.identifiantUtilisateur.formatter(),
        enregistréLeValue: dateChangement,
        raisonValue: raison,
        pièceJustificativeValue: piecesJustificatives,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Projet.details(identifiantProjet),
        message: 'Le changement de nom a été pris en compte',
      },
    };
  });

export const enregistrerChangementNomProjetAction = formAction(action, schema);
