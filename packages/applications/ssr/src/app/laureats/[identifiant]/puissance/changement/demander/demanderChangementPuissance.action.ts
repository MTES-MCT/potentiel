'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { strictlyPositiveNumberSchema } from '@/utils/candidature/schemaBase';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const demanderChangementPuissanceSchema = zod.object({
  identifiantProjet: zod.string().min(1),
  puissance: strictlyPositiveNumberSchema,
  raison: zod.string().min(1),
  piecesJustificatives: singleDocument({
    acceptedFileTypes: ['application/pdf'],
  }),
  isInformationEnregistree: zod.literal('false'),
});

const enregistrerChangementPuissanceSchema = zod.object({
  identifiantProjet: zod.string().min(1),
  puissance: strictlyPositiveNumberSchema,
  raison: zod.string().optional(),
  piecesJustificatives: singleDocument({
    acceptedFileTypes: ['application/pdf'],
    optional: true,
  }),
  isInformationEnregistree: zod.literal('true'),
});

const schema = zod.union([demanderChangementPuissanceSchema, enregistrerChangementPuissanceSchema]);

export type DemanderChangementPuissanceFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, puissance, piecesJustificatives, raison, isInformationEnregistree },
) =>
  withUtilisateur(async (utilisateur) => {
    const date = new Date().toISOString();
    const estUneInformationEnregistrée = isInformationEnregistree === 'true';

    if (estUneInformationEnregistrée) {
      await mediator.send<Lauréat.Puissance.EnregistrerChangementPuissanceUseCase>({
        type: 'Lauréat.Puissance.UseCase.EnregistrerChangement',
        data: {
          identifiantProjetValue: identifiantProjet,
          identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
          dateChangementValue: date,
          pièceJustificativeValue: piecesJustificatives,
          puissanceValue: puissance,
          raisonValue: raison,
        },
      });
    } else {
      await mediator.send<Lauréat.Puissance.DemanderChangementUseCase>({
        type: 'Lauréat.Puissance.UseCase.DemanderChangement',
        data: {
          identifiantProjetValue: identifiantProjet,
          identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
          dateDemandeValue: date,
          pièceJustificativeValue: piecesJustificatives,
          puissanceValue: puissance,
          raisonValue: raison,
        },
      });
    }

    return {
      status: 'success',
      redirection: {
        url: Routes.Puissance.changement.détails(identifiantProjet, date),
        message: estUneInformationEnregistrée
          ? 'Le changement de puissance a bien été enregistré'
          : 'La demande de changement de puissance a bien été enregistrée',
      },
    };
  });

export const demanderChangementPuissanceAction = formAction(action, schema);
