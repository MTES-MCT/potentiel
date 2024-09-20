'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { DomainError } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/candidature';
import { parseCsv } from '@potentiel-libraries/csv';
import { DateTime } from '@potentiel-domain/common';

import { ActionResult, FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { validateDocumentSize } from '@/utils/zod/documentError';

import { candidatureSchema, CandidatureShape } from '../importer/candidature.schema';
import { getLocalité } from '../helpers';

export type CorrigerCandidaturesState = FormState;

const schema = zod.object({
  fichierImport: zod.instanceof(Blob).superRefine((file, ctx) => {
    validateDocumentSize(file, ctx);
  }),
});

const action: FormAction<FormState, typeof schema> = async (_, { fichierImport }) =>
  withUtilisateur(async (utilisateur) => {
    const { parsedData, rawData } = await parseCsv(fichierImport.stream(), candidatureSchema);

    if (parsedData.length === 0) {
      return {
        status: 'form-error',
        errors: ['fichierImport'],
      };
    }

    let success: number = 0;
    const errors: ActionResult['errors'] = [];

    for (const line of parsedData) {
      try {
        const projectRawLine = rawData.find((data) => data['Nom projet'] === line.nom_projet) ?? {};

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
            key: line.nom_projet,
            reason: error.message,
          });
          continue;
        }
        errors.push({
          key: line.nom_projet,
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
  typeGarantiesFinancièresValue: line.type_gf,
  historiqueAbandonValue: line.historique_abandon,
  appelOffreValue: line.appel_offre,
  périodeValue: line.période,
  familleValue: line.famille,
  numéroCREValue: line.num_cre,
  nomProjetValue: line.nom_projet,
  sociétéMèreValue: line.société_mère,
  nomCandidatValue: line.nom_candidat,
  puissanceProductionAnnuelleValue: line.puissance_production_annuelle,
  prixReferenceValue: line.prix_reference,
  noteTotaleValue: line.note_totale,
  nomReprésentantLégalValue: line.nom_représentant_légal,
  emailContactValue: line.email_contact,
  localitéValue: getLocalité(line),
  statutValue: line.statut,
  motifÉliminationValue: line.motif_élimination,
  puissanceALaPointeValue: line.puissance_a_la_pointe,
  evaluationCarboneSimplifiéeValue: line.evaluation_carbone_simplifiée,
  technologieValue: line.technologie,
  actionnariatValue: line.financement_collectif
    ? Candidature.TypeActionnariat.financementCollectif.formatter()
    : line.gouvernance_partagée
      ? Candidature.TypeActionnariat.gouvernancePartagée.formatter()
      : undefined,
  dateÉchéanceGfValue: line.date_échéance_gf?.toISOString(),
  territoireProjetValue: line.territoire_projet,
  détailsValue: rawLine,
});

export const corrigerCandidaturesAction = formAction(action, schema);

const removeEmptyValues = (projectRawLine: Record<string, string>) => {
  return Object.fromEntries(Object.entries(projectRawLine).filter(([, value]) => value !== ''));
};
