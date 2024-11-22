'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  typeRepresentantLegal: zod.enum(
    ['Personne physique', 'Personne morale', 'Collectivité', 'Autre'],
    {
      invalid_type_error: 'Ce type de personne est invalide',
      required_error: 'Champ obligatoire',
    },
  ),
  nomRepresentantLegal: zod.string().min(1, { message: 'Champ obligatoire' }),
});

export type ModifierReprésentantLégalFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, nomRepresentantLegal, typeRepresentantLegal },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<ReprésentantLégal.ReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.ModifierReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateModificationValue: new Date().toISOString(),
        nomReprésentantLégalValue: nomRepresentantLegal,
        typeReprésentantLégalValue: typeRepresentantLegal,
      },
    });

    return {
      status: 'success',
      redirectUrl: Routes.Projet.details(identifiantProjet),
    };
  });

export const modifierReprésentantLégalAction = formAction(action, schema);
