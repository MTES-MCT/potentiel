import { z } from 'zod';

import {
  actionnariatSchema,
  adresse1Schema,
  adresse2Schema,
  codePostalSchema,
  communeSchema,
  doitRegenererAttestationSchema,
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
  choixCoefficientKSchema,
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
    doitRegenererAttestation: doitRegenererAttestationSchema,
    coefficientKChoisi: choixCoefficientKSchema,
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

const identifiantProjetSchema = z.string().min(1);

export const modifierLauréatEtCandidatureSchéma = z
  .object({
    identifiantProjet: identifiantProjetSchema,
    candidature: partialCandidatureNotifiéeSchema
      .refine((candidature) => !candidature || candidature.doitRegenererAttestation !== undefined, {
        path: ['doitRegenererAttestation'],
        message:
          "Vous devez choisir de régénérer ou pas l'attestation lorsque la candidature est corrigée",
      })
      .optional(),
    laureat: partialLauréatSchema.optional(),
  })
  .refine((value) => value.laureat || value.candidature, {
    // little hack as this is an error for the entire form
    path: ['identifiantProjet'],
    message: 'Le formulaire ne contient pas de modification',
  });

// this is used for validations errors
// the type won't work with the .optional() we need
const modifierLauréatEtCandidatureValidationSchéma = z.object({
  identifiantProjet: identifiantProjetSchema,
  candidature: partialCandidatureNotifiéeSchema,
  laureat: partialLauréatSchema,
});

export type ModifierCandidatureNotifiéeFormEntries = z.infer<typeof candidatureNotifiéeSchema>;
export type PartialModifierCandidatureNotifiéeFormEntries = z.infer<
  typeof partialCandidatureNotifiéeSchema
>;
export type ModifierLauréatValueFormEntries = z.infer<typeof lauréatSchema>;
export type PartialModifierLauréatValueFormEntries = z.infer<typeof partialLauréatSchema>;
export type ModifierLauréatKeys = keyof ModifierLauréatValueFormEntries;
export type ModifierLauréatEtCandidatureNotifiéeFormEntries = NestedKeys<
  z.infer<typeof modifierLauréatEtCandidatureValidationSchéma>
>;

// utils
type NestedKeys<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeys<T[K]>}`
          : `${K}`
        : never;
    }[keyof T]
  : never;
