'use server';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { Candidature } from '@potentiel-domain/projet';

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

    // await mediator.send<DéfinirFiltresUseCase>({
    //   type: 'Utilisateur.UseCase.DéfinirFiltres',
    //   data: {
    //     identifiantsProjetValues: [identifiantProjet],
    //     identifiantUtilisateurValue: identifiantUtilisateurInvité,
    //     invitéLeValue: DateTime.now().formatter(),
    //     invitéParValue: utilisateur.identifiantUtilisateur.formatter(),
    //   },
    // });

    return {
      status: 'success',
      redirection: {
        message: 'Filtres définis avec succès',
        url: Routes.TableauDeBord.consulter(),
      },
    };
  });

export const définirFiltresAction = formAction(action, schema);
