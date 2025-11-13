'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { DomainError } from '@potentiel-domain/core';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { parseCsv } from '@potentiel-libraries/csv';
import { DateTime } from '@potentiel-domain/common';
import { Période } from '@potentiel-domain/periode';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';

import { ActionResult, FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';
import { candidatureCsvSchema, candidatureCsvHeadersMapping } from '@/utils/candidature';
import { mapCsvRowToFournisseurs } from '@/utils/candidature/csv/fournisseurCsv';
import { removeEmptyValues } from '@/utils/candidature/removeEmptyValues';

const schema = zod.object({
  fichierImportCandidature: singleDocument({ acceptedFileTypes: ['text/csv'] }),
  appelOffre: zod.string(),
  periode: zod.string(),
  modeMultiple: zod.stringbool().optional(),
});

export type ImporterCandidaturesParCSVFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (
  _,
  { fichierImportCandidature, appelOffre, periode, modeMultiple },
) =>
  withUtilisateur(async (utilisateur) => {
    const { parsedData, rawData } = await parseCsv({
      fileStream: fichierImportCandidature.content,
      lineSchema: candidatureCsvSchema,
      columnsToVerify: Object.values(candidatureCsvHeadersMapping),
      parseOptions: {
        encoding: 'win1252',
        delimiter: ';',
      },
    });

    if (parsedData.length === 0) {
      return {
        status: 'validation-error',
        errors: { fichierImport: 'Fichier invalide' },
      };
    }

    const errors: ActionResult['errors'] = [];
    let success: number = 0;
    if (!modeMultiple) {
      const périodeCible = Période.IdentifiantPériode.convertirEnValueType(
        `${appelOffre}#${periode}`,
      );
      for (const line of parsedData) {
        const identifiantPériode = Période.IdentifiantPériode.convertirEnValueType(
          `${line.appelOffre}#${line.période})`,
        );
        if (!identifiantPériode.estÉgaleÀ(périodeCible)) {
          errors.push({
            key: `${line.numéroCRE} - ${line.nomProjet}`,
            reason: 'La période ne correspond pas à la cible',
          });
        }
      }
    }

    if (errors.length > 0) {
      return {
        status: 'success',
        result: {
          successMessage: '',
          errors,
        },
      };
    }

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
              dateConstitutionGf: undefined, // non supporté dans le CSV
              attestationConstitutionGf: undefined, // non supporté dans le CSV
              fournisseurs: mapCsvRowToFournisseurs(rawLine),
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

export const importerCandidaturesParCSVAction = formAction(action, schema);
