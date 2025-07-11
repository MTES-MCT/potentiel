'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { DomainError } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/projet';
import { parseCsv } from '@potentiel-libraries/csv';
import { DateTime } from '@potentiel-domain/common';

import { ActionResult, FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { singleDocument } from '@/utils/zod/document/singleDocument';
import { candidatureCsvSchema, CandidatureShape } from '@/utils/candidature';
import { mapCsvRowToFournisseurs } from '@/utils/candidature/fournisseurCsv';
import { removeEmptyValues } from '@/utils/candidature/removeEmptyValues';

import { getLocalité } from '../_helpers';

const schema = zod.object({
  fichierCorrectionCandidatures: singleDocument({ acceptedFileTypes: ['text/csv'] }),
});

export type CorrigerCandidaturesParLotFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, { fichierCorrectionCandidatures }) =>
  withUtilisateur(async (utilisateur) => {
    const { parsedData, rawData } = await parseCsv(
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
        const projectRawLine = rawData.find((data) => data['Nom projet'] === line.nomProjet) ?? {};

        await mediator.send<Candidature.CorrigerCandidatureUseCase>({
          type: 'Candidature.UseCase.CorrigerCandidature',
          data: {
            ...mapLineToUseCaseData(line, removeEmptyValues(projectRawLine)),
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
        successCount: success,
        errors,
      },
    };
  });

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
  prixRéférenceValue: line.prixRéférence,
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
  typeInstallationsAgrivoltaiquesValue: line.installationsAgrivoltaiques,
  élémentsSousOmbrièreValue: line.élémentsSousOmbrière,
  typologieDeBâtimentValue: line.typologieDeBâtiment,
  obligationDeSolarisationValue: line.obligationDeSolarisation,
  fournisseursValue: mapCsvRowToFournisseurs(rawLine),

  détailsValue: rawLine,
});

export const CorrigerCandidaturesParLotAction = formAction(action, schema);
