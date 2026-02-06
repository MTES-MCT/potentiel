'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { DomainError } from '@potentiel-domain/core';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { ImportCSV } from '@potentiel-libraries/csv';
import { DateTime } from '@potentiel-domain/common';

import { ActionResult, FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';
import {
  candidatureCsvSchema,
  cleanDétailsKeys,
  mapCsvRowToFournisseurs,
} from '@/utils/candidature';

const schema = zod.object({
  fichierCorrectionCandidatures: singleDocument({ acceptedFileTypes: ['text/csv'] }),
});

export type CorrigerCandidaturesParLotFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, { fichierCorrectionCandidatures }) =>
  withUtilisateur(async (utilisateur) => {
    //@TODO : besoin de l'ao pour vérifier les colonnes requises
    const { parsedData, rawData } = await ImportCSV.fromCSV(
      fichierCorrectionCandidatures.content,
      candidatureCsvSchema,
      { encoding: 'win1252', delimiter: ';' },
    );

    if (parsedData.length === 0) {
      return {
        status: 'validation-error',
        errors: { fichierCorrectionCandidatures: 'Fichier invalide' },
      };
    }

    let success: number = 0;
    const errors: ActionResult['errors'] = [];

    for (const line of parsedData) {
      try {
        const rawLine = cleanDétailsKeys(
          rawData.find((data) => data['Nom projet'] === line.nomProjet) ?? {},
        );
        await mediator.send<Candidature.CorrigerCandidatureUseCase>({
          type: 'Candidature.UseCase.CorrigerCandidature',
          data: {
            identifiantProjetValue: IdentifiantProjet.bind(line).formatter(),
            dépôtValue: {
              ...line,
              dateConstitutionGf: undefined, // non supporté dans le CSV
              attestationConstitutionGf: undefined, // non supporté dans le CSV
              fournisseurs: mapCsvRowToFournisseurs(rawLine),
            },
            instructionValue: line,
            détailsValue: rawLine,
            corrigéLe: DateTime.now().formatter(),
            corrigéPar: utilisateur.identifiantUtilisateur.formatter(),
          },
        });

        success++;
      } catch (error) {
        if (error instanceof DomainError) {
          errors.push({
            key: line.nomProjet,
            reason: error.message,
          });
          continue;
        }
        errors.push({
          key: line.nomProjet,
          reason: `Une erreur inconnue empêche la correction des candidatures`,
        });
      }
    }

    return {
      status: 'success',
      result: {
        successMessage:
          success === 0
            ? ''
            : success === 1
              ? `${success} candidat corrigé`
              : `${success} candidats corrigés`,
        errors,
      },
    };
  });

export const corrigerCandidaturesParLotAction = formAction(action, schema);
