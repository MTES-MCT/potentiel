'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Accès } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { withRateLimit } from '@/utils/withRateLimit';
import {
  numéroCRESchema,
  prixRéférenceSchema,
} from '@/utils/zod/candidature/candidatureFields.schema';

import { déchiffrerIdentifiantProjet } from '../_utils/chiffrement';

const commonSchema = {
  identifiantProjet: zod.string().min(1),
  // voir `generateIV` dans `../_utils/chiffrement.ts` pour plus d'informations
  iv: zod.string(),
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
    const { identifiantProjet: identifiantProjetChiffré, iv } = body;

    const identifiantProjetValue = déchiffrerIdentifiantProjet(identifiantProjetChiffré, iv);
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    await mediator.send<Accès.RéclamerAccèsProjetUseCase>({
      type: 'Projet.Accès.UseCase.RéclamerAccèsProjet',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateRéclamationValue: DateTime.now().formatter(),
        prix: body.hasSameEmail === 'true' ? 0 : body.prixReference,
        numéroCRE: body.hasSameEmail === 'true' ? '' : body.numeroCRE,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Utilisateur.réclamerProjet,
        message: `Vous avez désormais accès au projet ${body.nomProjet}`,
        linkUrl: {
          url: Routes.Projet.details(identifiantProjet.formatter()),
          label: 'Consulter le projet',
        },
      },
    };
  });
};

export const réclamerProjetAction = formAction(
  withRateLimit(action, {
    keyPrefix: 'réclamer-projet',
    message: 'Trop de tentatives, veuillez réessayer plus tard',
    points: 5, // 5 requests
    duration: 5 * 60, // per 5 minutes
    blockDuration: 60 * 60, // block 1 hour
    getKeySuffix: async (_, { identifiantProjet, iv }) =>
      déchiffrerIdentifiantProjet(identifiantProjet, iv),
  }),
  schema,
);
