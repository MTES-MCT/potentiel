'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { dépôtSchema } from '@/utils/candidature';
import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { manyDocuments } from '@/utils/zod/document/manyDocuments';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  installateur: dépôtSchema.shape.installateur,
  raison: zod.string().min(1),
  piecesJustificatives: manyDocuments({
    acceptedFileTypes: ['application/pdf'],
    optional: true,
  }),
});

export type ModifierInstallateurFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, installateur, raison, piecesJustificatives },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Installation.ModifierInstallateurUseCase>({
      type: 'Lauréat.Installation.UseCase.ModifierInstallateur',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateModificationValue: new Date().toISOString(),
        installateurValue: installateur ?? '',
        raisonValue: raison,
        pièceJustificativeValue: piecesJustificatives,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Lauréat.détails.installation(identifiantProjet),
        message: "Le changement d'installateur a été pris en compte",
      },
    };
  });

export const modifierInstallateurAction = formAction(action, schema);
