import { z } from 'zod';

import { conditionalRequiredError } from './schemaBase';
import {
  actionnariatSchema,
  adresse1Schema,
  adresse2Schema,
  codePostalSchema,
  dateEchéanceGfSchema,
  doitRegenererAttestationSchema,
  emailContactSchema,
  évaluationCarboneSimplifiéeSchema,
  motifEliminationSchema,
  nomCandidatSchema,
  nomProjetSchema,
  nomReprésentantLégalSchema,
  noteTotaleSchema,
  prixRéférenceSchema,
  puissanceALaPointeSchema,
  puissanceProductionAnnuelleSchema,
  sociétéMèreSchema,
  statutSchema,
  technologieSchema,
  typeGarantiesFinancieresSchema,
  communeSchema,
  départementSchema,
  régionSchema,
  choixCoefficientKSchema,
} from './candidatureFields.schema';

/**
 * Schema simplifié par rapport au CSV, pour utilisation dans des formulaires
 * Ne contient que les champs modifiables
 **/
export const candidatureSchema = z
  .object({
    identifiantProjet: z.string(),
    nomProjet: nomProjetSchema,
    societeMere: sociétéMèreSchema,
    nomCandidat: nomCandidatSchema,
    puissanceProductionAnnuelle: puissanceProductionAnnuelleSchema,
    prixReference: prixRéférenceSchema,
    noteTotale: noteTotaleSchema,
    nomRepresentantLegal: nomReprésentantLégalSchema,
    emailContact: emailContactSchema,
    adresse1: adresse1Schema,
    adresse2: adresse2Schema,
    codePostal: codePostalSchema,
    commune: communeSchema,
    departement: départementSchema,
    region: régionSchema,
    statut: statutSchema,
    puissanceALaPointe: puissanceALaPointeSchema,
    evaluationCarboneSimplifiee: évaluationCarboneSimplifiéeSchema,
    actionnariat: actionnariatSchema,
    doitRegenererAttestation: doitRegenererAttestationSchema,
    motifElimination: motifEliminationSchema, // see refine below
    technologie: technologieSchema,
    typeGarantiesFinancieres: typeGarantiesFinancieresSchema, // see refine below
    dateEcheanceGf: dateEchéanceGfSchema, // see refine below
    coefficientKChoisi: choixCoefficientKSchema,
  })
  // le motif d'élimination est obligatoire si la candidature est éliminée
  .superRefine((obj, ctx) => {
    if (obj.statut === 'éliminé' && !obj.motifElimination) {
      ctx.addIssue(conditionalRequiredError('motifElimination', 'statut', 'éliminé'));
    }
  })
  // le type de GF est obligatoire si la candidature est classée
  .superRefine((obj, ctx) => {
    if (obj.statut === 'classé' && !obj.typeGarantiesFinancieres) {
      ctx.addIssue(conditionalRequiredError('typeGarantiesFinancieres', 'statut', 'classé'));
    }
  })
  // la date d'échéance est obligatoire si les GF sont de type "avec date d'échéance"
  .superRefine((obj, ctx) => {
    if (
      obj.statut === 'classé' &&
      obj.typeGarantiesFinancieres === 'avec-date-échéance' &&
      !obj.dateEcheanceGf
    ) {
      ctx.addIssue(
        conditionalRequiredError(
          'dateEcheanceGf',
          'typeGarantiesFinancieres',
          'avec-date-échéance',
        ),
      );
    }
  });
