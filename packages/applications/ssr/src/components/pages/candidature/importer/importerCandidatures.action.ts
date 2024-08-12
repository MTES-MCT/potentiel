'use server';

import * as zod from 'zod';
import { mediator } from 'mediateur';

import { DomainError } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/candidature';
import { parseCsv } from '@potentiel-libraries/csv';

import { ActionResult, FormAction, formAction, FormState } from '@/utils/formAction';

import { candidatureSchema, CandidatureShape } from './candidature.schema';

export type ImporterCandidaturesState = FormState;

const schema = zod.object({
  fichierImport: zod.instanceof(Blob).refine((data) => data.size > 0),
});

const action: FormAction<FormState, typeof schema> = async (_, { fichierImport }) => {
  const lines = await parseCsv(fichierImport.stream(), candidatureSchema);

  if (lines.length === 0) {
    return {
      status: 'form-error',
      errors: ['fichierImport'],
    };
  }

  let success: number = 0;
  const errors: ActionResult['errors'] = [];

  for (const line of lines) {
    try {
      await mediator.send<Candidature.ImporterCandidatureUseCase>({
        type: 'Candidature.UseCase.ImporterCandidature',
        data: mapLineToUseCaseData(line),
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
};

const mapLineToUseCaseData = (
  line: CandidatureShape,
): Candidature.ImporterCandidatureUseCase['data'] => ({
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
  adresse1Value: line.adresse1,
  adresse2Value: line.adresse2,
  codePostalValue: line.code_postal,
  communeValue: line.commune,
  statutValue: line.statut,
  motifÉliminationValue: line.motif_élimination,
  puissanceALaPointeValue: line.puissance_a_la_pointe === 'oui',
  evaluationCarboneSimplifiéeValue: line.evaluation_carbone_simplifiée,
  valeurÉvaluationCarboneValue: line.valeur_évaluation_carbone,
  technologieValue: line.technologie,
  financementCollectifValue: line.financement_collectif === 'oui',
  gouvernancePartagéeValue: line.gouvernance_partagée === 'oui',
  dateÉchéanceGfValue: line.date_échéance_gf?.toISOString(),
  détailsValue: {},
});

export const importerCandidaturesAction = formAction(action, schema);
