import { z } from 'zod';

import { Candidature } from '@potentiel-domain/projet';

import { identifiantProjetSchema } from './identifiantProjet.schema';
import { NestedKeysForSchema } from './nestedKeysForSchema';
import {
  dépôtSchema,
  numéroDAutorisationDUrbanismeSchema,
  dateDAutorisationDUrbanismeSchema,
} from './dépôt.schema';
import { instructionSchema } from './instruction.schema';
import { booleanSchema, optionalEnumForCorrection } from './schemaBase';

export const doitRegenererAttestationSchema = booleanSchema.optional();

const candidatureNotifiéeSchema = z
  .object({
    actionnaire: dépôtSchema.shape.sociétéMère,
    nomRepresentantLegal: dépôtSchema.shape.nomReprésentantLégal,
    technologie: dépôtSchema.shape.technologie,
    nomCandidat: dépôtSchema.shape.nomCandidat,
    prixReference: dépôtSchema.shape.prixReference,
    evaluationCarboneSimplifiee: dépôtSchema.shape.evaluationCarboneSimplifiée,
    emailContact: dépôtSchema.shape.emailContact,
    nomProjet: dépôtSchema.shape.nomProjet,
    puissanceALaPointe: dépôtSchema.shape.puissanceALaPointe,
    puissance: dépôtSchema.shape.puissance,
    coefficientKChoisi: dépôtSchema.shape.coefficientKChoisi,
    puissanceDeSite: dépôtSchema.shape.puissanceDeSite,
    dateDAutorisationDUrbanisme: dateDAutorisationDUrbanismeSchema,
    numeroDAutorisationDUrbanisme: numéroDAutorisationDUrbanismeSchema,
    installateur: dépôtSchema.shape.installateur,
    dispositifDeStockage: dépôtSchema.shape.dispositifDeStockage,
    natureDeLExploitation: dépôtSchema.shape.natureDeLExploitation,
    // différence avec dépôt schéma
    noteTotale: instructionSchema.shape.noteTotale,
    actionnariat: optionalEnumForCorrection(z.enum(Candidature.TypeActionnariat.types)),
  })
  .extend(dépôtSchema.shape.localité.shape);

const partialCandidatureNotifiéeSchema = candidatureNotifiéeSchema.partial();

const lauréatSchema = z
  .object({
    actionnaire: dépôtSchema.shape.sociétéMère,
    nomRepresentantLegal: dépôtSchema.shape.nomReprésentantLégal,
    nomProjet: dépôtSchema.shape.nomProjet,
    puissance: dépôtSchema.shape.puissance,
    puissanceDeSite: dépôtSchema.shape.puissanceDeSite,
    nomCandidat: dépôtSchema.shape.nomCandidat,
    evaluationCarboneSimplifiee: dépôtSchema.shape.evaluationCarboneSimplifiée,
  })
  .extend(dépôtSchema.shape.localité.shape);

const partialLauréatSchema = lauréatSchema.partial();

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

export type ModifierLauréatEtCandidatureNotifiéeFormEntries = NestedKeysForSchema<
  z.infer<typeof modifierLauréatEtCandidatureSchéma>
>;
