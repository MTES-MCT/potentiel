'use server';
import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';
import type { DéfinirFiltresUtilisateurUseCase } from '@potentiel-domain/utilisateur';

import { transformToEnumArray } from '@/app/_helpers/transformToEnumArray';
import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  technologie: transformToEnumArray(zod.enum(AppelOffre.technologies)),
  cycle: transformToEnumArray(zod.enum(AppelOffre.cycles)),
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
