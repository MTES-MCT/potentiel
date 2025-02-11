import { z } from 'zod';

import { conditionalRequiredError, typeGf } from './schemaBase';
import {
  actionnariatSchema,
  adresse1Schema,
  adresse2Schema,
  codePostalSchema,
  dateEcheanceGfSchema,
  doitRegenererAttestationSchema,
  emailContactSchema,
  evaluationCarboneSimplifieeSchema,
  motifEliminationSchema,
  nomCandidatSchema,
  nomProjetSchema,
  nomRepresentantLegalSchema,
  noteTotaleSchema,
  prixReferenceSchema,
  puissanceALaPointeSchema,
  puissanceProductionAnnuelleSchema,
  sociétéMèreSchema,
  statutSchema,
  technologieSchema,
  typeGarantiesFinancieresSchema,
} from './candidatureFieldsSchema';

/** Schema simplifié pour utilisation sans données CSV */
export const candidatureSchema = z
  .object({
    identifiantProjet: z.string(),
    nomProjet: nomProjetSchema,
    societeMere: sociétéMèreSchema,
    nomCandidat: nomCandidatSchema,
    puissanceProductionAnnuelle: puissanceProductionAnnuelleSchema,
    prixReference: prixReferenceSchema,
    noteTotale: noteTotaleSchema,
    nomRepresentantLegal: nomRepresentantLegalSchema,
    emailContact: emailContactSchema,
    adresse1: adresse1Schema,
    adresse2: adresse2Schema,
    codePostal: codePostalSchema,
    statut: statutSchema,
    puissanceALaPointe: puissanceALaPointeSchema,
    evaluationCarboneSimplifiee: evaluationCarboneSimplifieeSchema,
    actionnariat: actionnariatSchema,
    doitRegenererAttestation: doitRegenererAttestationSchema,
    motifElimination: motifEliminationSchema,
    // see refine below
    technologie: technologieSchema,
    typeGarantiesFinancieres: typeGarantiesFinancieresSchema,
    // see refine below
    dateEcheanceGf: dateEcheanceGfSchema,
    // see refine below
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
    const actualTypeGf = obj.typeGarantiesFinancieres
      ? typeGf[Number(obj.typeGarantiesFinancieres)]
      : undefined;
    if (obj.statut === 'classé' && actualTypeGf === 'avec-date-échéance' && !obj.motifElimination) {
      ctx.addIssue(
        conditionalRequiredError(
          'dateEcheanceGf',
          'typeGarantiesFinancieres',
          'avec-date-échéance',
        ),
      );
    }
  });
