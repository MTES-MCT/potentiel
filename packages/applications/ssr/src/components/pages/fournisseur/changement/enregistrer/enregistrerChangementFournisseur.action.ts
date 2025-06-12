'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const commonSchema = {
  identifiantProjet: zod.string().min(1),
  evaluationCarboneSimplifiee: zod.coerce.number().positive(),
  raison: zod.string(),
  piecesJustificatives: singleDocument({
    acceptedFileTypes: ['application/pdf'],
  }),
};
const schema = zod.union([
  zod.object({
    ...commonSchema,
    technologie: zod.literal('pv'),
    fournisseurs: zod
      .array(
        zod.object({
          nomDuFabricant: zod.string(),
          typeFournisseur: zod.enum(Lauréat.Fournisseur.TypeFournisseur.typesFournisseurPV),
        }),
      )
      .optional(),
  }),
  zod.object({
    ...commonSchema,
    technologie: zod.literal('eolien'),
    fournisseurs: zod
      .array(
        zod.object({
          nomDuFabricant: zod.string(),
          typeFournisseur: zod.enum(Lauréat.Fournisseur.TypeFournisseur.typesFournisseurEolien),
        }),
      )
      .optional(),
  }),
]);

export type EnregistrerChangementFournisseurFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, fournisseurs, evaluationCarboneSimplifiee, piecesJustificatives, raison },
) =>
  withUtilisateur(async (utilisateur) => {
    const date = new Date().toISOString();

    await mediator.send<Lauréat.Fournisseur.EnregistrerChangementFournisseurUseCase>({
      type: 'Lauréat.Fournisseur.UseCase.EnregistrerChangement',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateChangementValue: date,
        pièceJustificativeValue: piecesJustificatives,
        fournisseursValue: fournisseurs,
        évaluationCarboneSimplifiéeValue: evaluationCarboneSimplifiee,
        raisonValue: raison,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Projet.details(identifiantProjet),
        message: 'Votre changement de fournisseur a bien été enregistré.',
      },
    };
  });

export const enregistrerChangementFournisseurAction = formAction(action, schema);
