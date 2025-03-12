'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { RéclamerProjetUseCase } from '@potentiel-domain/utilisateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

import {
  numéroCRESchema,
  prixRéférenceSchema,
} from '../../../../utils/zod/candidature/candidatureFields.schema';

const prixReferenceEtNumeroCRESchema = zod.object({
  identifiantProjet: zod.string().min(1),
  nomProjet: zod.string().min(1),
  prixReference: prixRéférenceSchema,
  numeroCRE: numéroCRESchema,
  hasSameEmail: zod.literal(true),
});
const schema = zod.union([
  prixReferenceEtNumeroCRESchema,
  zod.object({
    identifiantProjet: zod.string().min(1),
    nomProjet: zod.string().min(1),
    hasSameEmail: zod.literal(false),
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
        prixRéférence: body.hasSameEmail ? body.prixReference : undefined,
        numéroCRE: body.hasSameEmail ? body.numeroCRE : undefined,
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
