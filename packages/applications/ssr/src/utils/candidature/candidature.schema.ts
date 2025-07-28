import { z } from 'zod';

import { conditionalRequiredError } from './schemaBase';
import {
  actionnariatSchema,
  adresse1Schema,
  adresse2Schema,
  codePostalSchema,
  dateEchéanceOuDéliberationGfSchema,
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
  puissanceDeSiteSchema,
  identifiantProjetSchema,
} from './candidatureFields.schema';

/**
 * Schema simplifié par rapport au CSV, pour utilisation dans des formulaires
 * Ne contient que les champs modifiables
 **/
export const candidatureSchema = z
  .object({
    identifiantProjet: identifiantProjetSchema,
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
    statut: statutSchema.optional(), // plus modifiable une fois notifiée
    puissanceALaPointe: puissanceALaPointeSchema,
    evaluationCarboneSimplifiee: évaluationCarboneSimplifiéeSchema,
    actionnariat: actionnariatSchema,
    doitRegenererAttestation: doitRegenererAttestationSchema,
    motifElimination: motifEliminationSchema, // see refine below
    technologie: technologieSchema,
    typeGarantiesFinancieres: typeGarantiesFinancieresSchema, // see refine below
    dateEcheanceGf: dateEchéanceOuDéliberationGfSchema, // see refine below
    dateDeliberationGf: dateEchéanceOuDéliberationGfSchema, // see refine below
    coefficientKChoisi: choixCoefficientKSchema,
    puissanceDeSite: puissanceDeSiteSchema,
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
    if (
      obj.statut === 'classé' &&
      obj.typeGarantiesFinancieres === 'exemption' &&
      !obj.dateDeliberationGf
    ) {
      ctx.addIssue(
        conditionalRequiredError('dateDeliberationGf', 'typeGarantiesFinancieres', 'exemption'),
      );
    }
  });
