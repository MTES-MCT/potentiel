'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import type { Raccordement } from '@potentiel-domain/reseau';
import { DomainError } from '@potentiel-domain/core';
import { parseCsv } from '@potentiel-libraries/csv';

import { ActionResult, FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { validateDocumentSize } from '@/utils/zod/documentValidation';
export type CorrigerRéférencesDossierState = FormState;

const schema = zod.object({
  fichierCorrections: zod
    .instanceof(Blob)
    .superRefine((file, ctx) => validateDocumentSize(file, ctx)),
});

const csvSchema = zod
  .object({
    identifiantProjet: zod.string().min(1),
    referenceDossier: zod.string().min(1),
    referenceDossierCorrigee: zod.string().min(1),
  })
  .refine(
    ({ referenceDossier, referenceDossierCorrigee }) =>
      referenceDossier !== referenceDossierCorrigee,
    {
      path: ['referenceDossierCorrigee'],
      message: "La nouvelle référence de dossier doit être différente de l'ancienne",
    },
  );

const action: FormAction<FormState, typeof schema> = (_, { fichierCorrections }) =>
  withUtilisateur(async ({ role }) => {
    const { parsedData: lines } = await parseCsv(fichierCorrections.stream(), csvSchema, {
      // on conserve les espaces, car c'est potentiellement l'erreur à corriger
      ltrim: false,
      rtrim: false,
    });

    if (lines.length === 0) {
      return {
        status: 'validation-error',
        errors: ['Erreur lors du traitement du fichier CSV'],
      };
    }

    let success: number = 0;
    const errors: ActionResult['errors'] = [];

    // l'identifiant dans le fichier est au format "lisible" et pas au format technique
    // on remplace les séparateurs de segments de "-" en "#"
    // Ex: CRE4 - Bâtiment-1-2-3 => CRE4 - Bâtiment#1#2#3
    const parseIdentifiantProjet = (identifiant: string) =>
      identifiant.replace(/(.*)-(\d*)-(.{0,3})-(.*)/, '$1#$2#$3#$4');

    for (const { identifiantProjet, referenceDossier, referenceDossierCorrigee } of lines) {
      try {
        await mediator.send<Raccordement.ModifierRéférenceDossierRaccordementUseCase>({
          type: 'Réseau.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
          data: {
            identifiantProjetValue: parseIdentifiantProjet(identifiantProjet),
            nouvelleRéférenceDossierRaccordementValue: referenceDossierCorrigee,
            référenceDossierRaccordementActuelleValue: referenceDossier,
            rôleValue: role.nom,
          },
        });
        success++;
      } catch (error) {
        if (error instanceof DomainError) {
          errors.push({
            key: identifiantProjet,
            reason: error.message,
          });
          continue;
        }
        errors.push({
          key: identifiantProjet,
          reason:
            'Une erreur inconnue empêche la correction de la référence de dossier de raccordement',
        });
      }
    }

    return {
      status: 'success',
      result: {
        successCount: success,
        errors,
      },
    };
  });

export const corrigerRéférencesDossierAction = formAction(action, schema);
