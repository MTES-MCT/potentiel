'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Lauréat } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  nomProjet: zod.string().min(1, { message: 'Champ obligatoire' }),
  adresse1: zod.string().min(1, { message: 'Champ obligatoire' }),
  adresse2: zod.string().optional(),
  commune: zod.string().min(1, { message: 'Champ obligatoire' }),
  codePostal: zod.string().min(5).max(5),
  departement: zod.string().min(1, { message: 'Champ obligatoire' }),
  region: zod.string().min(1, { message: 'Champ obligatoire' }),
});

export type ModifierNomLocalitéLauréatFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, nomProjet, adresse1, adresse2, codePostal, commune, departement, region },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.ModifierLauréatUseCase>({
      type: 'Lauréat.UseCase.ModifierLauréat',
      data: {
        identifiantProjetValue: identifiantProjet,
        nomProjetValue: nomProjet,
        localitéValue: {
          adresse1,
          adresse2: adresse2 || '',
          codePostal,
          commune,
          département: departement,
          région: region,
        },
        modifiéLeValue: new Date().toISOString(),
        modifiéParValue: utilisateur.identifiantUtilisateur.email,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Projet.details(identifiantProjet),
        message: 'Le projet a été modifié',
      },
    };
  });

export const modifierNomLocalitéLauréatAction = formAction(action, schema);
