'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';
import { NestedKeysForSchema } from '@/utils/candidature';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  installateur: zod.string().min(1),
  raison: zod.string().min(1),
  piecesJustificatives: singleDocument({
    acceptedFileTypes: ['application/pdf'],
  }),
});

export type EnregistrerChangementInstallateurFormKeys = NestedKeysForSchema<
  zod.infer<typeof schema>
>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, installateur, piecesJustificatives, raison },
) =>
  withUtilisateur(async (utilisateur) => {
    const date = new Date().toISOString();

    await mediator.send<Lauréat.Installation.EnregistrerChangementInstallateurUseCase>({
      type: 'Lauréat.Installateur.UseCase.EnregistrerChangement',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateChangementValue: date,
        pièceJustificativeValue: piecesJustificatives,
        raisonValue: raison,
        installateurValue: installateur,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Installation.changementInstallateur.détails(identifiantProjet, date),
        message: "Le changement d'installateur a bien été enregistré.",
      },
    };
  });

export const enregistrerChangementInstallateurAction = formAction(action, schema);
