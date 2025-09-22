'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  dateDemande: zod.string().min(1),
  typeRepresentantLegal: zod.enum(Lauréat.ReprésentantLégal.TypeReprésentantLégal.types),
  nomRepresentantLegal: zod.string().min(1),
});

export type AccorderChangementReprésentantLégalFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, dateDemande, nomRepresentantLegal, typeRepresentantLegal },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.ReprésentantLégal.ReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        nomReprésentantLégalValue: nomRepresentantLegal,
        typeReprésentantLégalValue: typeRepresentantLegal,
        dateAccordValue: DateTime.now().formatter(),
        accordAutomatiqueValue: false,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.ReprésentantLégal.changement.détails(identifiantProjet, dateDemande),
        message: 'Le changement de représentant légal a bien été pris en compte',
      },
    };
  });

export const accorderChangementReprésentantLégalAction = formAction(action, schema);
