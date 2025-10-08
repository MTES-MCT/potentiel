import { z } from 'zod';

import {
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
  puissanceDeSiteSchema,
  dateDAutorisationDUrbanismeSchema,
  numéroDAutorisationDUrbanismeSchema,
  installateurSchema,
  dispositifDeStockageSchema,
  natureDeLExploitationOptionalSchema,
  actionnariatCorrigerCandidatureSchema,
} from './candidatureFields.schema';

const localitéSchema = z.object({
  adresse1: adresse1Schema,
  adresse2: adresse2Schema,
  codePostal: codePostalSchema,
  commune: communeSchema,
  departement: départementSchema,
  region: régionSchema,
});

const candidatureNotifiéeSchema = z
  .object({
    actionnaire: sociétéMèreSchema,
    nomRepresentantLegal: nomReprésentantLégalSchema,
    technologie: technologieSchema,
    nomCandidat: nomCandidatSchema,
    prixReference: prixRéférenceSchema,
    noteTotale: noteTotaleSchema,
    evaluationCarboneSimplifiee: évaluationCarboneSimplifiéeSchema,
    emailContact: emailContactSchema,
    actionnariat: actionnariatCorrigerCandidatureSchema,
    nomProjet: nomProjetSchema,
    puissanceALaPointe: puissanceALaPointeSchema,
    puissanceProductionAnnuelle: puissanceProductionAnnuelleSchema,
    coefficientKChoisi: choixCoefficientKSchema,
    puissanceDeSite: puissanceDeSiteSchema,
    dateDAutorisationDUrbanisme: dateDAutorisationDUrbanismeSchema,
    numeroDAutorisationDUrbanisme: numéroDAutorisationDUrbanismeSchema,
    installateur: installateurSchema,
    dispositifDeStockage: dispositifDeStockageSchema,
    natureDeLExploitation: natureDeLExploitationOptionalSchema,
  })
  .merge(localitéSchema);

const partialCandidatureNotifiéeSchema = candidatureNotifiéeSchema.partial();
const lauréatSchema = z
  .object({
    actionnaire: sociétéMèreSchema,
    nomRepresentantLegal: nomReprésentantLégalSchema,
    nomProjet: nomProjetSchema,
    puissanceProductionAnnuelle: puissanceProductionAnnuelleSchema,
    nomCandidat: nomCandidatSchema,
    evaluationCarboneSimplifiee: évaluationCarboneSimplifiéeSchema,
  })
  .merge(localitéSchema);

const partialLauréatSchema = lauréatSchema.partial();

const identifiantProjetSchema = z.string().min(1);

export const modifierLauréatEtCandidatureSchéma = z
  .object({
    identifiantProjet: identifiantProjetSchema,
    candidature: partialCandidatureNotifiéeSchema.optional(),
    laureat: partialLauréatSchema.optional(),
    doitRegenererAttestation: doitRegenererAttestationSchema,
  })
  .refine((value) => value.laureat || value.candidature, {
    // little hack to display this error for the entire form
    path: ['identifiantProjet'],
    message: 'Le formulaire ne contient pas de modification',
  })
  .refine((value) => !(value.candidature && value.doitRegenererAttestation === undefined), {
    path: ['doitRegenererAttestation'],
    message:
      "Vous devez choisir de régénérer ou pas l'attestation lorsque la candidature est corrigée",
  })
  .refine(
    (value) =>
      value.candidature || (!value.candidature && value.laureat && !value.doitRegenererAttestation),
    {
      path: ['doitRegenererAttestation'],
      message: "Vous pouvez régénérer l'attestation uniquement lorsque la candidature est corrigée",
    },
  );

export type ModifierCandidatureNotifiéeFormEntries = z.infer<typeof candidatureNotifiéeSchema>;
export type PartialModifierCandidatureNotifiéeFormEntries = z.infer<
  typeof partialCandidatureNotifiéeSchema
>;
export type ModifierLauréatValueFormEntries = z.infer<typeof lauréatSchema>;

export type PartialModifierLauréatValueFormEntries = z.infer<typeof partialLauréatSchema>;
export type ModifierLauréatKeys = keyof ModifierLauréatValueFormEntries;

export type ModifierLauréatEtCandidatureNotifiéeFormEntries = NestedKeys<
  z.infer<typeof modifierLauréatEtCandidatureSchéma>
>;

type NestedKeys<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object | undefined
        ? `${K}.${NestedKeys<NonNullable<T[K]>>}` | `${K}`
        : `${K}`;
    }[keyof T & string]
  : never;
