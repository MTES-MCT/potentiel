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
  puissance: dépôtSchema.shape.puissance,
  puissanceDeSite: dépôtSchema.shape.puissanceDeSite,
  raison: zod.string().min(1),
  piecesJustificatives: manyDocuments({
    acceptedFileTypes: ['application/pdf'],
    optional: true,
  }),
});

export type ModifierPuissanceFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, puissance, raison, puissanceDeSite, piecesJustificatives },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Puissance.ModifierPuissanceUseCase>({
      type: 'Lauréat.Puissance.UseCase.ModifierPuissance',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateModificationValue: new Date().toISOString(),
        raisonValue: raison,
        puissanceValue: puissance,
        puissanceDeSiteValue: puissanceDeSite,
        pièceJustificativeValue: piecesJustificatives,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Lauréat.détails.informationGénérales(identifiantProjet),
        message: 'Le changement de puissance a été pris en compte',
      },
    };
  });

export const modifierPuissanceAction = formAction(action, schema);
