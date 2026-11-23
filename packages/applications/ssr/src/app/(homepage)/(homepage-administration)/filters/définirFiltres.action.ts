'use server';
import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/projet';
import type { DéfinirFiltresUtilisateurUseCase } from '@potentiel-domain/utilisateur';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  technologie: zod.array(zod.enum(Candidature.TypeTechnologie.types)),
});

export type DéfinirFiltresFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, { technologie }) =>
  withUtilisateur(async (utilisateur) => {
    console.log(technologie);
    console.log(utilisateur);

    await mediator.send<DéfinirFiltresUtilisateurUseCase>({
      type: 'Utilisateur.UseCase.DéfinirFiltresUtilisateur',
      data: {
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        définiLeValue: DateTime.now().formatter(),
        filtresValue: { technologie },
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
