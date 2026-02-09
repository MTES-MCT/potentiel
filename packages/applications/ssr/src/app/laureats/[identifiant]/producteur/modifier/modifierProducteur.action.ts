'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { manyDocuments } from '@/utils/zod/document/manyDocuments';
import { dépôtSchema } from '@/utils/candidature';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  producteur: dépôtSchema.shape.nomCandidat,
  raison: zod.string().min(1),
  piecesJustificatives: manyDocuments({
    acceptedFileTypes: ['application/pdf'],
    optional: true,
  }),
});

export type ModifierProducteurFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, producteur, raison, piecesJustificatives },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Producteur.ModifierProducteurUseCase>({
      type: 'Lauréat.Producteur.UseCase.ModifierProducteur',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateModificationValue: new Date().toISOString(),
        producteurValue: producteur,
        raisonValue: raison,
        pièceJustificativeValue: piecesJustificatives,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Lauréat.détails.informationGénérales(identifiantProjet),
        message: 'Le changement de producteur a été pris en compte',
      },
    };
  });

export const modifierProducteurAction = formAction(action, schema);
