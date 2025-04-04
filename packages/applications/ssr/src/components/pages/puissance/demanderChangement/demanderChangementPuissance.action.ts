'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Puissance } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { strictlyPositiveNumberSchema } from '../../../../utils/zod/candidature/schemaBase';
import { singleDocument } from '../../../../utils/zod/document/singleDocument';

const demanderChangementPuissanceSchema = zod.object({
  identifiantProjet: zod.string().min(1),
  puissance: strictlyPositiveNumberSchema,
  raison: zod.string().min(1, { message: 'Champ obligatoire' }),
  piecesJustificatives: singleDocument({
    acceptedFileTypes: ['application/pdf'],
  }),
  isInformationEnregitree: zod.literal(false),
});

const enregistrerChangementPuissanceSchema = zod.object({
  identifiantProjet: zod.string().min(1),
  puissance: strictlyPositiveNumberSchema,
  raison: zod.string().min(1, { message: 'Champ obligatoire' }).optional(),
  piecesJustificatives: singleDocument({
    acceptedFileTypes: ['application/pdf'],
  }).optional(),
  isInformationEnregitree: zod.literal(true),
});

const schema = zod.union([demanderChangementPuissanceSchema, enregistrerChangementPuissanceSchema]);

export type DemanderChangementPuissanceFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, puissance, piecesJustificatives, raison, isInformationEnregitree },
) =>
  withUtilisateur(async (utilisateur) => {
    const dateDemandeValue = new Date().toISOString();

    if (isInformationEnregitree) {
      await mediator.send<Puissance.PuissanceUseCase.EnregistrerChangement>({
        type: 'Lauréat.Puissance.UseCase.EnregistrerChangement',
        data: {
          identifiantProjetValue: identifiantProjet,
          identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
          dateDemandeValue,
          pièceJustificativeValue: piecesJustificatives,
          puissanceValue: puissance,
          raisonValue: raison,
        },
      });
    } else {
      await mediator.send<Puissance.PuissanceUseCase>({
        type: 'Lauréat.Puissance.UseCase.DemanderChangement',
        data: {
          identifiantProjetValue: identifiantProjet,
          identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
          dateDemandeValue,
          pièceJustificativeValue: piecesJustificatives,
          puissanceValue: puissance,
          raisonValue: raison,
        },
      });
    }

    return {
      status: 'success',
      redirection: {
        url: Routes.Puissance.changement.détails(identifiantProjet, dateDemandeValue),
        message: 'La demande de changement de puissance a bien été enregistrée',
      },
    };
  });

export const demanderChangementPuissanceAction = formAction(action, schema);
