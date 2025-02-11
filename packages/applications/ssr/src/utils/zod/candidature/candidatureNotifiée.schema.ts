import { z } from 'zod';

import {
  actionnariatSchema,
  adresse1Schema,
  adresse2Schema,
  codePostalSchema,
  communeSchema,
  départementSchema,
  emailContactSchema,
  nomCandidatSchema,
  nomProjetSchema,
  nomReprésentantLégalSchema,
  noteTotaleSchema,
  prixRéférenceSchema,
  puissanceALaPointeSchema,
  puissanceProductionAnnuelleSchema,
  régionSchema,
  sociétéMèreSchema,
  technologieSchema,
  évaluationCarboneSimplifiéeSchema,
} from './candidatureFields.schema';

const localitéSchema = z.object({
  adresse1: adresse1Schema,
  adresse2: adresse2Schema,
  codePostal: codePostalSchema,
  commune: communeSchema,
  departement: départementSchema,
  region: régionSchema,
});

export const candidatureNotifiéeSchema = z
  .object({
    actionnaire: sociétéMèreSchema,
    nomRepresentantLegal: nomReprésentantLégalSchema,
    technologie: technologieSchema,
    nomCandidat: nomCandidatSchema,
    prixReference: prixRéférenceSchema,
    noteTotale: noteTotaleSchema,
    evaluationCarboneSimplifiee: évaluationCarboneSimplifiéeSchema,
    emailContact: emailContactSchema,
    actionnariat: actionnariatSchema,
    nomProjet: nomProjetSchema,
    puissanceALaPointe: puissanceALaPointeSchema,
    puissanceProductionAnnuelle: puissanceProductionAnnuelleSchema,
  })
  .merge(localitéSchema);

export const lauréatSchema = z
  .object({
    actionnaire: sociétéMèreSchema,
    nomRepresentantLegal: nomReprésentantLégalSchema,
    nomProjet: nomProjetSchema,
    puissanceProductionAnnuelle: puissanceProductionAnnuelleSchema,
  })
  .merge(localitéSchema);

export const identifiantProjetSchema = z.object({
  identifiantProjet: z.string().min(1),
});

export const modifierLauréatEtCandidatureSchéma = z
  .object({ candidature: candidatureNotifiéeSchema })
  .merge(z.object({ laureat: lauréatSchema }))
  .partial()
  .merge(identifiantProjetSchema);

export type ModifierCandidatureNotifiéeFormEntries = z.infer<typeof candidatureNotifiéeSchema>;
export type ModifierLauréatValueFormEntries = z.infer<typeof lauréatSchema>;
export type ModifierLauréatKeys = keyof ModifierLauréatValueFormEntries;
export type ModifierCandidatureNotifiéeKeys = keyof ModifierCandidatureNotifiéeFormEntries;
