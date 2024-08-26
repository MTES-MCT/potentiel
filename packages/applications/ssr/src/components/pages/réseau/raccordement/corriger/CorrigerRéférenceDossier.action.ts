'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import type { Raccordement } from '@potentiel-domain/reseau';
import { DomainError } from '@potentiel-domain/core';
import { parseCsv } from '@potentiel-libraries/csv';

import { ActionResult, FormAction, FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
export type CorrigerRéférencesDossierState = FormState;

const schema = zod.object({
  fichierCorrections: zod.instanceof(Blob).refine((data) => data.size > 0),
});

const csvSchema = zod.object({
  identifiantProjet: zod.string().min(1),
  referenceDossier: zod.string().min(1),
  referenceDossierCorrigee: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = (_, { fichierCorrections }) =>
  withUtilisateur(async ({ role }) => {
    const { parsedData: lines } = await parseCsv(fichierCorrections.stream(), csvSchema, {
      // on conserve les espaces, car c'est potentiellement l'erreur à corriger
      ltrim: false,
      rtrim: false,
    });

    if (lines.length === 0) {
      return {
        status: 'form-error',
        errors: ['fichierCorrections'],
      };
    }

    let success: number = 0;
    const errors: ActionResult['errors'] = [];

    // l'identifiant dans le fichier est au format "lisible" et pas au format technique
    // on remplace les séparateurs de segments de "-" en "#"
    // Ex: CRE4 - Bâtiment-1-2-3 => CRE4 - Bâtiment#1#2#3
    const parseIdentifiantProjet = (identifiant: string) =>
      identifiant.replace(/(.*)-(\d*)-(.*)-(\d*)/, '$1#$2#$3#$4');

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
