'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';
import { notFound } from 'next/navigation';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { manyDocuments } from '@/utils/zod/document/manyDocuments';

const commonSchema = {
  identifiantProjet: zod.string().min(1),
  evaluationCarboneSimplifiee: zod.coerce.number().positive(),
  raison: zod.string(),
  piecesJustificatives: manyDocuments({
    acceptedFileTypes: ['application/pdf'],
  }),
};
const schema = zod.discriminatedUnion('technologie', [
  zod.object({
    ...commonSchema,
    technologie: zod.literal('pv'),
    fournisseurs: zod.array(
      zod.object({
        nomDuFabricant: zod.string().min(1, { message: 'Le nom du fabricant est requis' }),
        typeFournisseur: zod.enum(Lauréat.Fournisseur.TypeFournisseur.typesFournisseurPV, {
          message: `Ce type de fournisseur n'est pas compatible avec la technologie PV`,
        }),
        lieuDeFabrication: zod.string().min(1, { message: 'Le lieu de fabrication est requis' }),
      }),
    ),
  }),
  zod.object({
    ...commonSchema,
    technologie: zod.literal('eolien'),
    fournisseurs: zod.array(
      zod.object({
        nomDuFabricant: zod.string().min(1, { message: 'Le nom du fabricant est requis' }),
        typeFournisseur: zod.enum(Lauréat.Fournisseur.TypeFournisseur.typesFournisseurEolien, {
          message: `Ce type de fournisseur n'est pas compatible avec la technologie Eolien`,
        }),
        lieuDeFabrication: zod.string().min(1, { message: 'Le lieu de fabrication est requis' }),
      }),
    ),
  }),
]);

export type EnregistrerChangementFournisseurFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, fournisseurs, evaluationCarboneSimplifiee, piecesJustificatives, raison },
) =>
  withUtilisateur(async (utilisateur) => {
    const date = new Date().toISOString();

    const fournisseurActuel = await mediator.send<Lauréat.Fournisseur.ConsulterFournisseurQuery>({
      type: 'Lauréat.Fournisseur.Query.ConsulterFournisseur',
      data: { identifiantProjet },
    });

    if (Option.isNone(fournisseurActuel)) {
      notFound();
    }

    const evaluationCarboneSimplifieeModifiée =
      evaluationCarboneSimplifiee !== fournisseurActuel.évaluationCarboneSimplifiée
        ? evaluationCarboneSimplifiee
        : undefined;

    const fournisseursModifiés = fournisseursContiennentModification({
      fournisseursActuels: fournisseurActuel.fournisseurs,
      nouveauxFournisseurs: fournisseurs.map(Lauréat.Fournisseur.Fournisseur.convertirEnValueType),
    })
      ? fournisseurs
      : undefined;

    const common = {
      identifiantProjetValue: identifiantProjet,
      identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
      dateChangementValue: date,
      pièceJustificativeValue: piecesJustificatives,
      raisonValue: raison,
    };

    const payload: Lauréat.Fournisseur.EnregistrerChangementFournisseurUseCase['data'] | undefined =
      fournisseursModifiés
        ? {
            ...common,
            fournisseursValue: fournisseursModifiés,
            évaluationCarboneSimplifiéeValue: evaluationCarboneSimplifieeModifiée,
          }
        : evaluationCarboneSimplifieeModifiée
          ? {
              ...common,
              évaluationCarboneSimplifiéeValue: evaluationCarboneSimplifieeModifiée,
            }
          : undefined;

    if (!payload) {
      return {
        status: 'validation-error',
        errors: {
          evaluationCarboneSimplifiee:
            'Le changement de fournisseur doit contenir une modification',
          ...(fournisseurs.length && {
            [`fournisseurs.${fournisseurs.length - 1}.typeFournisseur`]:
              'Le changement de fournisseur doit contenir une modification',
          }),
        },
      };
    }

    await mediator.send<Lauréat.Fournisseur.EnregistrerChangementFournisseurUseCase>({
      type: 'Lauréat.Fournisseur.UseCase.EnregistrerChangement',
      data: payload,
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Fournisseur.changement.détails(identifiantProjet, date),
        message: 'Votre changement de fournisseur a bien été pris en compte',
      },
    };
  });

export const enregistrerChangementFournisseurAction = formAction(action, schema);

const fournisseursContiennentModification = ({
  nouveauxFournisseurs,
  fournisseursActuels,
}: {
  fournisseursActuels: Array<Lauréat.Fournisseur.Fournisseur.ValueType>;
  nouveauxFournisseurs: Array<Lauréat.Fournisseur.Fournisseur.ValueType>;
}) => {
  if (nouveauxFournisseurs.length !== fournisseursActuels.length) {
    return true;
  }

  return nouveauxFournisseurs.some((fournisseurModifié, i) => {
    const fournisseur = fournisseursActuels[i];
    return !fournisseur.estÉgaleÀ(fournisseurModifié);
  });
};
