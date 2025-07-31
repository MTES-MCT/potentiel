import { z } from 'zod';

import {
  actionnariatSchema,
  adresse1Schema,
  adresse2Schema,
  codePostalSchema,
  dateEchéanceOuDéliberationGfSchema,
  emailContactSchema,
  évaluationCarboneSimplifiéeSchema,
  nomCandidatSchema,
  nomProjetSchema,
  nomReprésentantLégalSchema,
  prixRéférenceSchema,
  puissanceALaPointeSchema,
  puissanceProductionAnnuelleSchema,
  sociétéMèreSchema,
  technologieSchema,
  typeGarantiesFinancieresSchema,
  communeSchema,
  départementSchema,
  régionSchema,
  choixCoefficientKSchema,
} from './candidatureFields.schema';

export const dépôtSchema = z.object({
  nomProjet: nomProjetSchema,
  sociétéMère: sociétéMèreSchema,
  nomCandidat: nomCandidatSchema,
  puissanceProductionAnnuelle: puissanceProductionAnnuelleSchema,
  prixReference: prixRéférenceSchema,
  nomReprésentantLégal: nomReprésentantLégalSchema,
  emailContact: emailContactSchema,
  puissanceALaPointe: puissanceALaPointeSchema,
  evaluationCarboneSimplifiée: évaluationCarboneSimplifiéeSchema,
  actionnariat: actionnariatSchema,
  technologie: technologieSchema,
  typeGarantiesFinancières: typeGarantiesFinancieresSchema,
  dateÉchéanceGf: dateEchéanceOuDéliberationGfSchema,
  dateDélibérationGf: dateEchéanceOuDéliberationGfSchema,
  coefficientKChoisi: choixCoefficientKSchema,
  // typeInstallationsAgrivoltaiques: typeInstallationsAgrivoltaiquesSchema,
  // élémentsSousOmbrière: élémentsSousOmbrièreCsvSchema
  // typologieDeBâtiment
  // obligationDeSolarisation

  // TODO move to addressSchema
  adresse1: adresse1Schema,
  adresse2: adresse2Schema,
  codePostal: codePostalSchema,
  commune: communeSchema,
  departement: départementSchema,
  region: régionSchema,
});
