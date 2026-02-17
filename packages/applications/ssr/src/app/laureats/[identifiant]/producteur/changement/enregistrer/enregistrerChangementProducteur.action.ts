'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';
import { dépôtSchema } from '@/utils/candidature';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  producteur: dépôtSchema.shape.nomCandidat,
  raison: zod.string().optional(),
  piecesJustificatives: singleDocument({
    acceptedFileTypes: ['application/pdf'],
  }),
});

export type EnregistrerChangementProducteurFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, producteur, piecesJustificatives, raison },
) =>
  withUtilisateur(async (utilisateur) => {
    const date = new Date().toISOString();

    await mediator.send<Lauréat.Producteur.EnregistrerChangementProducteurUseCase>({
      type: 'Lauréat.Producteur.UseCase.EnregistrerChangement',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateChangementValue: date,
        pièceJustificativeValue: piecesJustificatives,
        producteurValue: producteur,
        raisonValue: raison,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Lauréat.lister(),
        message:
          "Votre changement de producteur a bien été enregistré. Vous n'avez plus accès au projet sur Potentiel",
      },
    };
  });

export const enregistrerChangementProducteurAction = formAction(action, schema);
