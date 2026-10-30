'use server';
import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { type Accès, IdentifiantProjet } from '@potentiel-domain/projet';
import type { InviterPorteurUseCase } from '@potentiel-domain/utilisateur';

import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { récupérerLesProjetsAuxquelsInviterLePorteur } from './récupérerLesProjetsAuxquelsInviterLePorteur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  identifiantUtilisateurInvité: zod.email().min(1),
  inviterATousSesProjets: zod.literal('true').optional(),
  statutProjet: zod.enum(['classé', 'éliminé']).optional(),
});

export type InviterPorteurFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, identifiantUtilisateurInvité, inviterATousSesProjets, statutProjet },
) =>
  withUtilisateur(async (utilisateur) => {
    const invitationMultiple = inviterATousSesProjets === 'true';

    const identifiantsProjet = await récupérerLesProjetsAuxquelsInviterLePorteur({
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      invitationMultiple,
      utilisateur,
      utilisateurInvité: identifiantUtilisateurInvité,
    });

    if (!identifiantsProjet.length) {
      return {
        status: 'success',
        redirection: {
          message: `L'utilisateur a déjà accès à ${invitationMultiple ? 'ces projets' : 'ce projet'}`,
          url: Routes.Accès.lister(identifiantProjet, statutProjet ?? 'classé'),
        },
      };
    }

    if (invitationMultiple) {
      await mediator.send<InviterPorteurUseCase>({
        type: 'Utilisateur.UseCase.InviterPorteur',
        data: {
          identifiantsProjetValues: identifiantsProjet,
          identifiantUtilisateurValue: identifiantUtilisateurInvité,
          invitéLeValue: DateTime.now().formatter(),
          invitéParValue: utilisateur.identifiantUtilisateur.formatter(),
        },
      });

      let success = 0;

      for (const identifiantProjet of identifiantsProjet) {
        await mediator.send<Accès.AutoriserAccèsProjetUseCase>({
          type: 'Projet.Accès.UseCase.AutoriserAccèsProjet',
          data: {
            identifiantProjetValue: identifiantProjet,
            identifiantUtilisateurValue: identifiantUtilisateurInvité,
            autoriséLeValue: DateTime.now().formatter(),
            autoriséParValue: utilisateur.identifiantUtilisateur.formatter(),
            raison: 'invitation',
          },
        });
        success++;
      }

      return {
        status: 'success',
        redirection: {
          message: `Utilisateur invité avec succès à ${success === 1 ? 'ce projet' : `${success} projets`}`,
          url: Routes.Lauréat.lister(),
        },
      };
    }

    await mediator.send<InviterPorteurUseCase>({
      type: 'Utilisateur.UseCase.InviterPorteur',
      data: {
        identifiantsProjetValues: [identifiantProjet],
        identifiantUtilisateurValue: identifiantUtilisateurInvité,
        invitéLeValue: DateTime.now().formatter(),
        invitéParValue: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    await mediator.send<Accès.AutoriserAccèsProjetUseCase>({
      type: 'Projet.Accès.UseCase.AutoriserAccèsProjet',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: identifiantUtilisateurInvité,
        autoriséLeValue: DateTime.now().formatter(),
        autoriséParValue: utilisateur.identifiantUtilisateur.formatter(),
        raison: 'invitation',
      },
    });

    return {
      status: 'success',
      redirection: {
        message: 'Utilisateur invité avec succès',
        url: Routes.Accès.lister(identifiantProjet, statutProjet ?? 'classé'),
      },
    };
  });

export const inviterPorteurAction = formAction(action, schema);
