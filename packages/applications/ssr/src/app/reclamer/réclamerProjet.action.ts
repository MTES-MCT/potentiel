'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { Routes } from '@potentiel-applications/routes';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import type { Accès } from '@potentiel-domain/projet';
import type { CréerPorteurUseCase } from '@potentiel-domain/utilisateur';

import { numéroCRESchema, prixRéférenceSchema } from '@/utils/candidature/candidatureFields.schema';
import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withRateLimit } from '@/utils/withRateLimit';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { déchiffrerIdentifiantProjet } from './_helpers/chiffrement';

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
        ...(body.hasSameEmail === 'true'
          ? { type: 'même-email-candidature' }
          : { type: 'avec-prix-numéro-cre', numéroCRE: body.numeroCRE, prix: body.prixReference }),
      },
    });

    await mediator.send<CréerPorteurUseCase>({
      type: 'Utilisateur.UseCase.CréerPorteur',
      data: {
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
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
