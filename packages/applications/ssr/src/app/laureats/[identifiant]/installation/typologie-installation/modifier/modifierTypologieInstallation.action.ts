'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { NestedKeysWithArrayIndices } from '@/utils/zod/nestedKeysWithArrayIndices';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  typologieInstallation: zod.array(
    zod.object({
      typologie: zod.enum(Candidature.TypologieInstallation.typologies),
      details: zod.string().optional(),
    }),
  ),
});

export type ModifierTypologieInstallationFormKeys = NestedKeysWithArrayIndices<
  zod.infer<typeof schema>
>;

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
        typologieInstallationValue: typologieInstallation.map((typologieInstallation) => ({
          typologie: typologieInstallation.typologie,
          détails: typologieInstallation.details,
        })),
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Projet.details(identifiantProjet),
        message: 'Le changement de typologie a été pris en compte',
      },
    };
  });

export const modifierTypologieInstallationAction = formAction(action, schema);
