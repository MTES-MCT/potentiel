'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { DomainError } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/candidature';
import { parseCsv } from '@potentiel-libraries/csv';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { ActionResult, FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';
import { candidatureCsvSchema, CandidatureShape } from '@/utils/zod/candidature';

import { getLocalité } from '../helpers';

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
        const projectRawLine = rawData.find((data) => data['Nom projet'] === line.nomProjet) ?? {};
        await mediator.send<Candidature.ImporterCandidatureUseCase>({
          type: 'Candidature.UseCase.ImporterCandidature',
          data: {
            ...mapLineToUseCaseData(line, projectRawLine),
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
        errors.push({
          key: `${line.numéroCRE} - ${line.nomProjet}`,
          reason: `Une erreur inconnue empêche l'import des candidatures`,
        });
      }
    }

    return {
      status: 'success',
      result: {
        successCount: success,
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

const removeEmptyValues = (projectRawLine: Record<string, string>) => {
  return Object.fromEntries(Object.entries(projectRawLine).filter(([, value]) => value !== ''));
};

const mapLineToUseCaseData = (
  line: CandidatureShape,
  rawLine: Record<string, string>,
): Omit<Candidature.ImporterCandidatureUseCase['data'], 'importéLe' | 'importéPar'> => ({
  typeGarantiesFinancièresValue: line.typeGf,
  historiqueAbandonValue: line.historiqueAbandon,
  appelOffreValue: line.appelOffre,
  périodeValue: line.période,
  familleValue: line.famille,
  numéroCREValue: line.numéroCRE,
  nomProjetValue: line.nomProjet,
  sociétéMèreValue: line.sociétéMère,
  nomCandidatValue: line.nomCandidat,
  puissanceProductionAnnuelleValue: line.puissanceProductionAnnuelle,
  prixReferenceValue: line.prixRéférence,
  noteTotaleValue: line.noteTotale,
  nomReprésentantLégalValue: line.nomReprésentantLégal,
  emailContactValue: line.emailContact,
  localitéValue: getLocalité(line),
  statutValue: line.statut,
  motifÉliminationValue: line.motifÉlimination,
  puissanceALaPointeValue: line.puissanceÀLaPointe,
  evaluationCarboneSimplifiéeValue: line.evaluationCarboneSimplifiée,
  technologieValue: line.technologie,
  actionnariatValue: line.financementCollectif
    ? Candidature.TypeActionnariat.financementCollectif.formatter()
    : line.gouvernancePartagée
      ? Candidature.TypeActionnariat.gouvernancePartagée.formatter()
      : undefined,
  dateÉchéanceGfValue: line.dateÉchéanceGf?.toISOString(),
  territoireProjetValue: line.territoireProjet,
  coefficientKChoisiValue: line.coefficientKChoisi,
  détailsValue: removeEmptyValues(rawLine),
});
