'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { Accès, IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { withRateLimit } from '@/utils/withRateLimit';
import { numéroCRESchema } from '@/utils/candidature/identifiantProjet.schema';

import { dépôtSchema } from '../../utils/candidature';

import { déchiffrerIdentifiantProjet } from './_helpers/chiffrement';

const commonSchema = {
  identifiantProjet: zod.string().min(1),
  // voir `generateIV` dans `../_utils/chiffrement.ts` pour plus d'informations
  iv: zod.string(),
  nomProjet: zod.string().min(1),
};

const prixReferenceEtNumeroCRESchema = zod.object({
  ...commonSchema,
  prixReference: dépôtSchema.shape.prixReference,
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
