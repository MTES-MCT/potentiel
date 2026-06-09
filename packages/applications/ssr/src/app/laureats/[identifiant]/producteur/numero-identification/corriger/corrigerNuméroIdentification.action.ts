'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { requiredSiretSchema } from '@/utils/candidature';
import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { manyDocuments } from '@/utils/zod/document/manyDocuments';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  siret: requiredSiretSchema,
  raison: zod.string().min(1).optional(),
  piecesJustificatives: manyDocuments({
    acceptedFileTypes: ['application/pdf'],
  }),
});

export type CorrigerNuméroIdentificationFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, raison, piecesJustificatives, siret },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Producteur.CorrigerNuméroIdentificationUseCase>({
      type: 'Lauréat.Producteur.UseCase.CorrigerNuméroIdentification',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateCorrectionValue: new Date().toISOString(),
        raisonValue: raison,
        pièceJustificativeValue: piecesJustificatives,
        numéroIdentificationValue: { siret },
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Lauréat.détails.informationGénérales(identifiantProjet),
        message: "La correction de votre numéro d'identification (SIRET) a été prise en compte",
      },
    };
  });

export const corrigerNuméroIdentificationAction = formAction(action, schema);
