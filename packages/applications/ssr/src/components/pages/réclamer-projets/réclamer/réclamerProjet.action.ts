'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { RéclamerProjetUseCase } from '@potentiel-domain/utilisateur';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

import {
  numéroCRESchema,
  prixRéférenceSchema,
} from '../../../../utils/zod/candidature/candidatureFields.schema';

const commonSchema = {
  identifiantProjet: zod.string().min(1),
  nomProjet: zod.string().min(1),
};

const prixReferenceEtNumeroCRESchema = zod.object({
  ...commonSchema,
  prixReference: prixRéférenceSchema,
  numeroCRE: numéroCRESchema,
  hasSameEmail: zod.literal('false'),
});

const schema = zod.discriminatedUnion('hasSameEmail', [
  prixReferenceEtNumeroCRESchema,
  zod.object({
    ...commonSchema,
    hasSameEmail: zod.literal('true'),
  }),
]);

export type RéclamerProjetsFormKeys = keyof zod.infer<typeof prixReferenceEtNumeroCRESchema>;

const action: FormAction<FormState, typeof schema> = async (_, body) => {
  return withUtilisateur(async (utilisateur) => {
    await mediator.send<RéclamerProjetUseCase>({
      type: 'Utilisateur.UseCase.RéclamerProjet',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(
          body.identifiantProjet,
        ).formatter(),
        identifiantUtilisateur: utilisateur.identifiantUtilisateur.formatter(),
        réclaméLe: DateTime.now().formatter(),
        prixRéférence: body.hasSameEmail === 'true' ? undefined : body.prixReference,
        numéroCRE: body.hasSameEmail === 'true' ? undefined : body.numeroCRE,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Utilisateur.réclamerProjet,
        message: `Vous avez désormais accès au projet ${body.nomProjet}`,
      },
    };
  });
};

export const réclamerProjetAction = formAction(action, schema);
