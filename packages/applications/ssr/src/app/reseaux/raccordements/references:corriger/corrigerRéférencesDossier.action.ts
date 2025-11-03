'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { DomainError } from '@potentiel-domain/core';
import { parseCsv } from '@potentiel-libraries/csv';
import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { ActionResult, FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';

const schema = zod.object({
  fichierCorrections: singleDocument({ acceptedFileTypes: ['text/csv'] }),
});

export type CorrigerRéférencesDossierFormKeys = keyof zod.infer<typeof schema>;

const csvSchema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossier: zod.string().min(1),
  referenceDossierCorrigee: zod.string().trim().optional(),
});

const action: FormAction<FormState, typeof schema> = (_, { fichierCorrections }) =>
  withUtilisateur(async (utilisateur) => {
    const { parsedData: lines } = await parseCsv(fichierCorrections.content, csvSchema, {
      // on conserve les espaces, car c'est potentiellement l'erreur à corriger
      ltrim: false,
      rtrim: false,
    });

    if (lines.length === 0) {
      return {
        status: 'validation-error',
        errors: { fichierCorrections: 'Fichier invalide' },
      };
    }

    let success: number = 0;
    const errors: ActionResult['errors'] = [];

    // l'identifiant dans le fichier est au format "lisible" et pas au format technique
    // on remplace les séparateurs de segments de "-" en "#"
    // Ex: CRE4 - Bâtiment-1-2-3 => CRE4 - Bâtiment#1#2#3
    // Ex: CRE4 - Bâtiment-P1-F2-3 => CRE4 - Bâtiment#1#2#3
    const parseIdentifiantProjet = (identifiant: string) =>
      identifiant.replace(/(.*)-P?(\d*)-F?(.{0,3})-(.*)/, '$1#$2#$3#$4');

    for (const { identifiantProjet, referenceDossier, referenceDossierCorrigee } of lines) {
      if (!referenceDossierCorrigee) {
        continue;
      }
      if (referenceDossier === referenceDossierCorrigee) {
        continue;
      }
      try {
        await mediator.send<Lauréat.Raccordement.ModifierRéférenceDossierRaccordementUseCase>({
          type: 'Lauréat.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
          data: {
            identifiantProjetValue: parseIdentifiantProjet(identifiantProjet),
            nouvelleRéférenceDossierRaccordementValue: referenceDossierCorrigee,
            référenceDossierRaccordementActuelleValue: referenceDossier,
            rôleValue: utilisateur.rôle.nom,
            modifiéeLeValue: DateTime.now().formatter(),
            modifiéeParValue: utilisateur.identifiantUtilisateur.formatter(),
          },
        });
        success++;
      } catch (error) {
        if (error instanceof DomainError) {
          errors.push({
            key: referenceDossier,
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

    if (errors.length === 0 && success > 0) {
      return {
        status: 'success',
        redirection: {
          url: Routes.Raccordement.lister,
          message: `${success} références de dossier de raccordement ont été mises à jour`,
        },
      };
    }

    return {
      status: 'success',
      result: {
        successMessage:
          success === 0
            ? ''
            : success === 1
              ? `${success} référence dossier modifiée`
              : `${success} références dossier modifiées`,
        errors,
      },
    };
  });

export const corrigerRéférencesDossierAction = formAction(action, schema);
