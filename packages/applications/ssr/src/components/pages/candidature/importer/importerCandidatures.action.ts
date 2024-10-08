'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { DomainError } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/candidature';
import { parseCsv } from '@potentiel-libraries/csv';
import { DateTime } from '@potentiel-domain/common';

import { ActionResult, FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { document } from '@/utils/zod/documentTypes';

import { getLocalité } from '../helpers';

import { candidatureSchema, CandidatureShape } from './candidature.schema';

const schema = zod.object({
  fichierImportCandidature: document,
});

export type ImporterCandidaturesFormKeys = keyof zod.infer<typeof schema>;

const action: FormAction<FormState, typeof schema> = async (_, { fichierImportCandidature }) => {
  return withUtilisateur(async (utilisateur) => {
    const { parsedData, rawData } = await parseCsv(
      fichierImportCandidature.stream(),
      candidatureSchema,
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
        const projectRawLine = rawData.find((data) => data['Nom projet'] === line.nom_projet) ?? {};
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
            key: line.nom_projet,
            reason: error.message,
          });
          continue;
        }
        errors.push({
          key: line.nom_projet,
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
  détailsValue: removeEmptyValues(rawLine),
});
