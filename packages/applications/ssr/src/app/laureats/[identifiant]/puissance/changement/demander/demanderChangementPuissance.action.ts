'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { manyDocuments } from '@/utils/zod/document/manyDocuments';
import { dépôtSchema } from '@/utils/candidature';

const demanderChangementPuissanceSchema = zod.object({
  identifiantProjet: zod.string().min(1),
  puissance: dépôtSchema.shape.puissance,
  puissanceDeSite: dépôtSchema.shape.puissanceDeSite,
  raison: zod.string().min(1),
  piecesJustificatives: manyDocuments({
    acceptedFileTypes: ['application/pdf'],
  }),
  isInformationEnregistree: zod.literal('false'),
});

const enregistrerChangementPuissanceSchema = zod.object({
  identifiantProjet: zod.string().min(1),
  puissance: dépôtSchema.shape.puissance,
  puissanceDeSite: dépôtSchema.shape.puissanceDeSite,
  raison: zod.string().optional(),
  piecesJustificatives: manyDocuments({
    acceptedFileTypes: ['application/pdf'],
    optional: true,
  }),
  isInformationEnregistree: zod.literal('true'),
});

const schema = zod.union([demanderChangementPuissanceSchema, enregistrerChangementPuissanceSchema]);

export type DemanderChangementPuissanceFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  {
    identifiantProjet,
    puissance,
    puissanceDeSite,
    piecesJustificatives,
    raison,
    isInformationEnregistree,
  },
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
          puissanceDeSiteValue: puissanceDeSite,
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
          puissanceDeSiteValue: puissanceDeSite,
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
