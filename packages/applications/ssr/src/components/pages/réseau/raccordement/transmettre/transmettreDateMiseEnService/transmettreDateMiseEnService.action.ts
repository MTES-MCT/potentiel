'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Raccordement } from '@potentiel-domain/reseau';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossier: zod.string().min(1),
  dateDesignation: zod.string().min(1),
  dateMiseEnService: zod.string().min(1, { message: 'Champ obligatoire' }),
});

export type TransmettreDateMiseEnServiceStateFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, referenceDossier, dateMiseEnService, dateDesignation },
) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<Raccordement.RaccordementUseCase>({
      type: 'Réseau.Raccordement.UseCase.TransmettreDateMiseEnService',
      data: {
        identifiantProjetValue: identifiantProjet,
        référenceDossierValue: referenceDossier,
        dateMiseEnServiceValue: new Date(dateMiseEnService).toISOString(),
        dateDésignationValue: dateDesignation,
      },
    });

    return {
      status: 'success',
      redirectUrl: utilisateur.role.estÉgaleÀ(Role.grd)
        ? Routes.Raccordement.lister
        : Routes.Raccordement.détail(identifiantProjet),
    };
  });
};

export const transmettreDateMiseEnServiceAction = formAction(action, schema);
