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
  actionnaire: zod.string().min(1, { message: 'Champ obligatoire' }),
  raison: zod.string().min(1, { message: 'Champ obligatoire' }),
  piecesJustificatives: manyDocuments({
    acceptedFileTypes: ['application/pdf'],
  }),
});

export type DemanderChangementActionnaireFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, actionnaire, piecesJustificatives, raison },
) =>
  withUtilisateur(async (utilisateur) => {
    const dateDemandeValue = new Date().toISOString();

    await mediator.send<Lauréat.Actionnaire.ActionnaireUseCase>({
      type: 'Lauréat.Actionnaire.UseCase.DemanderChangement',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateDemandeValue,
        pièceJustificativeValue: piecesJustificatives,
        actionnaireValue: actionnaire,
        raisonValue: raison,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Actionnaire.changement.détails(identifiantProjet, dateDemandeValue),
        message: "La demande de changement d'actionnaire(s) a bien été enregistrée",
      },
    };
  });

export const demanderChangementActionnaireAction = formAction(action, schema);
