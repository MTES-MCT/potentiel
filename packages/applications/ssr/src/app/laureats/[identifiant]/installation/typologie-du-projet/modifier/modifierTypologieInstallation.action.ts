'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { ArrayFormKeys } from '@/utils/zod/arrayFormKeys';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  typologieInstallation: zod.array(
    zod.object({
      typologie: zod.enum(Candidature.TypologieInstallation.typologies),
      details: zod.string().optional(),
    }),
  ),
});

export type ModifierTypologieInstallationFormKeys = ArrayFormKeys<zod.infer<typeof schema>>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, typologieInstallation },
) =>
  withUtilisateur(async (utilisateur) => {
    await mediator.send<Lauréat.Installation.ModifierTypologieInstallationUseCase>({
      type: 'Lauréat.Installation.UseCase.ModifierTypologieInstallation',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateModificationValue: new Date().toISOString(),
        typologieInstallationValue: typologieInstallation.map((t) => ({
          typologie: t.typologie,
          détails: t.details,
        })),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Lauréat.détails.installation(identifiantProjet),
        message: 'La modification de la typologie du projet a été prise en compte',
      },
    };
  });

export const modifierTypologieInstallationAction = formAction(action, schema);
