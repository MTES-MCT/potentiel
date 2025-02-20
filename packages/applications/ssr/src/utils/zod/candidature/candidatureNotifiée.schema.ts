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

const partialCandidatureNotifiéeSchema = candidatureNotifiéeSchema.partial();

export const lauréatSchema = z
  .object({
    actionnaire: sociétéMèreSchema,
    nomRepresentantLegal: nomReprésentantLégalSchema,
    nomProjet: nomProjetSchema,
    puissanceProductionAnnuelle: puissanceProductionAnnuelleSchema,
  })
  .merge(localitéSchema);

const partialLauréatSchema = lauréatSchema.partial();

export const identifiantProjetSchema = z.object({
  identifiantProjet: z.string().min(1),
});

export const modifierLauréatEtCandidatureSchéma = z
  .object({ candidature: partialCandidatureNotifiéeSchema })
  .merge(z.object({ laureat: partialLauréatSchema }))
  .merge(identifiantProjetSchema);

type NestedKeys<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeys<T[K]>}`
          : `${K}`
        : never;
    }[keyof T]
  : never;

export type ModifierCandidatureNotifiéeFormEntries = z.infer<typeof candidatureNotifiéeSchema>;
export type PartialModifierCandidatureNotifiéeFormEntries = z.infer<
  typeof partialCandidatureNotifiéeSchema
>;
export type ModifierCandidatureNotifiéeKeys = keyof ModifierCandidatureNotifiéeFormEntries;
export type ModifierLauréatValueFormEntries = z.infer<typeof lauréatSchema>;
export type PartialModifierLauréatValueFormEntries = z.infer<typeof partialLauréatSchema>;
export type ModifierLauréatKeys = keyof ModifierLauréatValueFormEntries;
export type ModifierLauréatEtCandidatureNotifiéeFormEntries = NestedKeys<
  z.infer<typeof modifierLauréatEtCandidatureSchéma>
>;
