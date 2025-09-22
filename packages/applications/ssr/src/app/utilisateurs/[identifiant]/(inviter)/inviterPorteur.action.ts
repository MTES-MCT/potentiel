'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { OperationRejectedError } from '@potentiel-domain/core';
import { Accès, IdentifiantProjet } from '@potentiel-domain/projet';
import { InviterPorteurUseCase, Utilisateur } from '@potentiel-domain/utilisateur';

import { FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  identifiantUtilisateurInvite: zod.email().min(1),
  inviterATousSesProjets: zod.literal('true').optional(),
});

export type InviterPorteurFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, identifiantUtilisateurInvite, inviterATousSesProjets },
) =>
  withUtilisateur(async (utilisateur) => {
    if (inviterATousSesProjets === 'true') {
      const identifiantsProjet = await récupérerTousLesProjets(utilisateur);
      await mediator.send<InviterPorteurUseCase>({
        type: 'Utilisateur.UseCase.InviterPorteur',
        data: {
          identifiantsProjetValues: identifiantsProjet,
          identifiantUtilisateurValue: identifiantUtilisateurInvite,
          invitéLeValue: DateTime.now().formatter(),
          invitéParValue: utilisateur.identifiantUtilisateur.formatter(),
        },
      });

      let success = 0;
      for (const identifiantProjet of identifiantsProjet) {
        try {
          await mediator.send<Accès.AutoriserAccèsProjetUseCase>({
            type: 'Projet.Accès.UseCase.AutoriserAccèsProjet',
            data: {
              identifiantProjetValue: identifiantProjet,
              identifiantUtilisateurValue: identifiantUtilisateurInvite,
              autoriséLeValue: DateTime.now().formatter(),
              autoriséParValue: utilisateur.identifiantUtilisateur.formatter(),
              raison: 'invitation',
            },
          });
          success++;
        } catch (e) {
          if (e instanceof Accès.AccèsProjetDéjàAutoriséError) {
            continue;
          }
          throw e;
        }
      }

      return {
        status: 'success',
        redirection: {
          message: `Utilisateur invité avec succès à ${success} projets`,
          url: Routes.Projet.lister(),
        },
      };
    }

    await mediator.send<InviterPorteurUseCase>({
      type: 'Utilisateur.UseCase.InviterPorteur',
      data: {
        identifiantsProjetValues: [identifiantProjet],
        identifiantUtilisateurValue: identifiantUtilisateurInvite,
        invitéLeValue: DateTime.now().formatter(),
        invitéParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    await mediator.send<Accès.AutoriserAccèsProjetUseCase>({
      type: 'Projet.Accès.UseCase.AutoriserAccèsProjet',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: identifiantUtilisateurInvite,
        autoriséLeValue: DateTime.now().formatter(),
        autoriséParValue: utilisateur.identifiantUtilisateur.formatter(),
        raison: 'invitation',
      },
    });

    return {
      status: 'success',
      redirection: {
        message: 'Utilisateur invité avec succès',
        url: Routes.Utilisateur.listerPorteurs(
          IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
        ),
      },
    };
  });

const récupérerTousLesProjets = async (utilisateur: Utilisateur.ValueType) => {
  if (!utilisateur.role.estPorteur()) {
    throw new OperationRejectedError(
      'Seuls les Porteurs de Projet peuvent inviter à tous les projets',
    );
  }
  const accès = await mediator.send<Accès.ListerAccèsQuery>({
    type: 'Projet.Accès.Query.ListerAccès',
    data: {
      identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
    },
  });

  return accès.items.map((accès) => accès.identifiantProjet.formatter());
};

export const inviterPorteurAction = formAction(action, schema);
