'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  typeDePersonne: zod.enum(['Personne physique', 'Personne morale', 'Collectivité', 'Autre'], {
    invalid_type_error: 'Ce type de personne est invalide',
    required_error: 'Champ obligatoire',
  }),
  nomRepresentantLegal: zod.string().min(1, { message: 'Champ obligatoire' }),
});

export type CorrigerReprésentantLégalFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, nomRepresentantLegal, typeDePersonne },
) =>
  withUtilisateur(async (utilisateur) => {
    console.log('typeDePersonne: ', typeDePersonne);
    await mediator.send<ReprésentantLégal.ReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.CorrigerReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateCorrectionValue: new Date().toISOString(),
        nomReprésentantLégalValue: nomRepresentantLegal,
      },
    });

    return {
      status: 'success',
      redirectUrl: Routes.Projet.details(identifiantProjet),
    };
  });

export const corrigerReprésentantLégalAction = formAction(action, schema);
