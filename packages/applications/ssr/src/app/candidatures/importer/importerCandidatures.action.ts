'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { DomainError } from '@potentiel-domain/core';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { parseCsv } from '@potentiel-libraries/csv';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { getLogger } from '@potentiel-libraries/monitoring';

import { ActionResult, FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';
import { candidatureCsvSchema } from '@/utils/candidature';
import { mapCsvRowToFournisseurs } from '@/utils/candidature/csv/fournisseurCsv';
import { removeEmptyValues } from '@/utils/candidature/removeEmptyValues';

import { getLocalité } from '../_helpers';

const schema = zod.object({
  fichierImportCandidature: singleDocument({ acceptedFileTypes: ['text/csv'] }),
});

export type ImporterCandidaturesFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, { fichierImportCandidature }) => {
  return withUtilisateur(async (utilisateur) => {
    const { parsedData, rawData } = await parseCsv(
      fichierImportCandidature.content,
      candidatureCsvSchema,
      { encoding: 'win1252', delimiter: ';' },
    );

    if (parsedData.length === 0) {
      return {
        status: 'validation-error',
        errors: { fichierImport: 'Fichier invalide' },
      };
    }

    let success: number = 0;
    const errors: ActionResult['errors'] = [];

    for (const line of parsedData) {
      try {
        const rawLine = removeEmptyValues(
          rawData.find((data) => data['Nom projet'] === line.nomProjet) ?? {},
        );
        await mediator.send<Candidature.ImporterCandidatureUseCase>({
          type: 'Candidature.UseCase.ImporterCandidature',
          data: {
            identifiantProjetValue: IdentifiantProjet.bind(line).formatter(),
            dépôtValue: {
              ...line,
              dateDélibérationGf: undefined, // non supporté dans le CSV
              fournisseurs: mapCsvRowToFournisseurs(rawLine),
              localité: getLocalité(line),
            },
            instructionValue: line,
            détailsValue: rawLine,
            importéLe: DateTime.now().formatter(),
            importéPar: utilisateur.identifiantUtilisateur.formatter(),
          },
        });

        success++;
      } catch (error) {
        if (error instanceof DomainError) {
          errors.push({
            key: `${line.numéroCRE} - ${line.nomProjet}`,
            reason: error.message,
          });
          continue;
        }
        getLogger().error(error as Error);
        errors.push({
          key: `${line.numéroCRE} - ${line.nomProjet}`,
          reason: `Une erreur inconnue empêche l'import des candidatures`,
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
              ? `${success} candidat importé`
              : `${success} candidats importés`,
        errors,
      },
      redirection:
        success > 0 && errors.length === 0
          ? {
              url: Routes.Période.lister({
                appelOffre: parsedData[0].appelOffre,
                statut: 'a-notifier',
              }),
            }
          : undefined,
    };
  });
};

export const importerCandidaturesAction = formAction(action, schema);
