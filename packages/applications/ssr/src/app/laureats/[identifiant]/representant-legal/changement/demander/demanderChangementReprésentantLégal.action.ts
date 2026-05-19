'use server';

import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { demanderOuEnregistrerChangementSchema } from '../../_helpers/schema';

const action: FormAction<FormState, typeof demanderOuEnregistrerChangementSchema> = async (
  _,
  { identifiantProjet, nomRepresentantLegal, typeRepresentantLegal, piecesJustificatives },
) =>
  withUtilisateur(async (utilisateur) => {
    const dateDemandeValue = new Date().toISOString();

    await mediator.send<Lauréat.ReprésentantLégal.DemanderChangementReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.DemanderChangementReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        nomReprésentantLégalValue: nomRepresentantLegal,
        typeReprésentantLégalValue: typeRepresentantLegal,
        pièceJustificativeValue: piecesJustificatives,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateDemandeValue,
      },
    });
    return {
      status: 'success',
      redirection: {
        url: Routes.ReprésentantLégal.changement.détails(identifiantProjet, dateDemandeValue),
        message: 'La demande de changement de représentant légal a bien été transmise',
      },
    };
  });

export const demanderChangementReprésentantLégalAction = formAction(
  action,
  demanderOuEnregistrerChangementSchema,
);
