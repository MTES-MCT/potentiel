'use server';
import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { type DéfinirFiltresUtilisateurUseCase, Filtres } from '@potentiel-domain/utilisateur';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  technologie: zod.array(zod.enum(Filtres.technologie)),
  cycle: zod.array(zod.enum(Filtres.cycle)),
});

export type DéfinirFiltresFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, filtres) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<DéfinirFiltresUtilisateurUseCase>({
      type: 'Utilisateur.UseCase.DéfinirFiltresUtilisateur',
      data: {
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        définisLeValue: DateTime.now().formatter(),
        filtresValue: filtres,
      },
    });

    return {
      status: 'success',
      redirection: {
        message: 'Filtres définis avec succès',
        url: Routes.TableauDeBord.consulter(),
      },
    };
  });

export const définirFiltresAction = formAction(action, schema);
