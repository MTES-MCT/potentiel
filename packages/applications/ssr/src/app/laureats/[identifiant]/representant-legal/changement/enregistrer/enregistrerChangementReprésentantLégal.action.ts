'use server';

import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { demanderOuEnregistrerChangementSchema } from '../../_helpers/schema';

const action: FormAction<FormState, typeof demanderOuEnregistrerChangementSchema> = async (
  _,
  { identifiantProjet, nomRepresentantLegal, typeRepresentantLegal, piecesJustificatives },
) =>
  withUtilisateur(async (utilisateur) => {
    const dateChangement = new Date().toISOString();

    await mediator.send<Lauréat.ReprésentantLégal.EnregistrerChangementReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.EnregistrerChangementReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        nomReprésentantLégalValue: nomRepresentantLegal,
        typeReprésentantLégalValue: typeRepresentantLegal,
        pièceJustificativeValue: piecesJustificatives,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateChangementValue: dateChangement,
      },
    });
    return {
      status: 'success',
      redirection: {
        url: Routes.ReprésentantLégal.changement.détails(identifiantProjet, dateChangement),
        message: 'Le changement de représentant légal a bien été transmis',
      },
    };
  });

export const enregistrerChangementReprésentantLégalAction = formAction(
  action,
  demanderOuEnregistrerChangementSchema,
);
